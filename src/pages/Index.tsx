
import { useState, useRef } from 'react';
import { Upload, X, Check, Clock, FileText, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { toast } from 'sonner';

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
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const newFiles = Array.from(fileList);
    if (newFiles.some(file => !file.name.match(/\.(xlsx|csv)$/i))) {
      toast.error('Please upload only Excel or CSV files');
      return;
    }
    setFiles(prevFiles => [...prevFiles, ...newFiles].slice(0, 5));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const processData = () => {
    if (files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    setProcessing(true);
    setCurrentStep('process');

    // Simulate processing progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setCurrentStep('review');
        setProcessing(false);
      }
    }, 200);
  };

  const renderUploadStep = () => (
    <>
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center"
           onDragEnter={handleDrag}
           onDragLeave={handleDrag}
           onDragOver={handleDrag}
           onDrop={handleDrop}>
        <div className={`transition-all duration-200 ${dragActive ? 'scale-105' : ''}`}>
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload size={24} className="text-accent-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Drag your file(s) or browse</h3>
          <p className="text-gray-500 mb-4">Add your documents here, and you can upload up to 5 files</p>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            multiple 
            accept=".csv,.xlsx"
            onChange={handleFileInputChange}
          />
          <div className="flex flex-col items-center gap-4">
            <input type="text" 
                  placeholder="Add file URL"
                  className="w-full max-w-md mx-auto px-4 py-2 border border-gray-200 rounded-lg" />
            <div className="flex gap-4">
              <button 
                onClick={handleBrowseClick}
                className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Browse Files
              </button>
              <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Upload
              </button>
            </div>
          </div>
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
              <button 
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
          ))}
          <div className="flex justify-end space-x-4">
            <button 
              onClick={() => setFiles([])}
              className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button 
              onClick={processData}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Process Data
            </button>
          </div>
        </div>
      )}
    </>
  );

  const renderProcessingStep = () => (
    <div className="py-12 animate-fade-in">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 size={24} className="text-primary animate-spin" />
        </div>
        <h3 className="text-xl font-medium mb-2">Processing your data</h3>
        <p className="text-gray-500 mb-8">Please wait while we process your files. This may take a few minutes.</p>
        <Progress value={progress} className="h-2 mb-4" />
        <p className="text-sm text-gray-500">{progress}% Complete</p>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="animate-fade-in">
      <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6 flex items-center gap-3">
        <Check size={20} className="text-success" />
        <p className="text-success">Your files have been processed successfully!</p>
      </div>
      
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-500 font-medium">Name</th>
              <th className="px-6 py-3 text-left text-gray-500 font-medium">Email</th>
              <th className="px-6 py-3 text-left text-gray-500 font-medium">Department</th>
              <th className="px-6 py-3 text-left text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array(5).fill(null).map((_, i) => (
              <tr key={i} className="bg-white">
                <td className="px-6 py-4">John Doe</td>
                <td className="px-6 py-4">john@example.com</td>
                <td className="px-6 py-4">Engineering</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6 space-x-4">
        <button className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button 
          onClick={() => setCurrentStep('finalize')}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          Continue
        </button>
      </div>
    </div>
  );

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
                const isCompleted = steps.findIndex(s => s.id === currentStep) > 
                                  steps.findIndex(s => s.id === step.id);
                
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

            {currentStep === 'upload' && renderUploadStep()}
            {currentStep === 'process' && renderProcessingStep()}
            {currentStep === 'review' && renderReviewStep()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
