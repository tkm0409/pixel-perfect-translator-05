
import { useState } from 'react';
import { Upload, X, Check, Clock, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

const steps = [
  { id: 'upload', label: 'Upload File', icon: Upload },
  { id: 'process', label: 'Process Data', icon: FileText },
  { id: 'review', label: 'Review & Edit', icon: Check },
  { id: 'finalize', label: 'Finalise & Submit', icon: Check },
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      
      <main className="ml-16 pt-16 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <select className="bg-accent text-accent-foreground px-4 py-2 rounded-lg font-medium">
                <option>Abbott</option>
                <option>Other Client</option>
              </select>
              <h2 className="text-xl font-semibold">New Data Upload</h2>
            </div>

            <div className="flex items-center justify-between mb-12">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = false; // Add logic for completion
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                        ${isActive ? 'bg-primary text-white' : 
                          isCompleted ? 'bg-success text-white' : 
                          'bg-gray-100 text-gray-400'}`}>
                        <StepIcon size={20} />
                      </div>
                      <span className="text-sm text-gray-600">{step.label}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-32 h-[2px] bg-gray-200 mx-4" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center"
                 onDragEnter={handleDrag}
                 onDragLeave={handleDrag}
                 onDragOver={handleDrag}
                 onDrop={handleDrop}>
              <div className={`transition-all duration-200 ${dragActive ? 'scale-105' : ''}`}>
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload size={24} className="text-accent-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Drag your file(s)</h3>
                <p className="text-gray-500 mb-4">Add your documents here, and you can upload up to 5 files</p>
                <input type="text" 
                       placeholder="Add file URL"
                       className="w-full max-w-md mx-auto px-4 py-2 border border-gray-200 rounded-lg mb-4" />
                <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Upload
                </button>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-8 space-y-4 animate-slide-up">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText size={20} className="text-gray-400" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)}MB</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <div className="flex justify-end space-x-4">
                  <button className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Process Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
