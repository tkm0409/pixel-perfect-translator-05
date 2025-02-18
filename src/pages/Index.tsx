import { useState, useRef } from 'react';
import { Upload, X, Check, Clock, FileText, Loader2, Pencil } from 'lucide-react';
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
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [tableData, setTableData] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', department: 'Sales', status: 'Inactive' },
    { id: 4, name: 'Sarah Brown', email: 'sarah@example.com', department: 'HR', status: 'Active' },
    { id: 5, name: 'Tom Wilson', email: 'tom@example.com', department: 'Engineering', status: 'Active' },
  ]);

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
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6">
            <div className="w-full h-full rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          </div>
          <h3 className="text-2xl font-medium mb-3">Processing Your Data...</h3>
          <p className="text-gray-600 mb-8">
            Our AI model is checking for errors, mapping data fields, and<br />
            applying corrections. You will see a detailed breakdown once<br />
            processing is complete.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-semibold text-emerald-600">160</span>
              <Check className="text-emerald-600" />
            </div>
            <p className="text-sm text-emerald-700">Records Processing Completed</p>
          </div>
          <div className="bg-red-50/50 border border-red-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-semibold text-red-500">160</span>
              <X className="text-red-500" />
            </div>
            <p className="text-sm text-red-600">Records Processing Failed</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-semibold text-gray-700">90</span>
              <Clock className="text-gray-600" />
            </div>
            <p className="text-sm text-gray-600">Records Processing</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-semibold text-gray-700">8</span>
              <Clock className="text-gray-600" />
            </div>
            <p className="text-sm text-gray-600">Records Processing (min)</p>
          </div>
        </div>

        <button 
          className="px-6 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => setCurrentStep('upload')}>
          Cancel Processing
        </button>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="animate-fade-in">
      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="col-span-2">
          <div className="flex items-center space-x-4 mb-6">
            <img src="/lovable-uploads/77a389ed-b170-4c9b-95b1-2f4f5f1ea875.png" alt="Processing Complete" className="w-48" />
            <div>
              <h3 className="text-2xl font-medium mb-2">Data Processing Complete!</h3>
              <p className="text-gray-600">
                AI has successfully processed your data. Below is a breakdown of the records. Click on any category to review and make changes.
              </p>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <button className="w-full px-6 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Review Records
            </button>
            <button className="w-full px-6 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Edit or Fix any errors
            </button>
            <button className="w-full px-6 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Finalise and submit the processed data
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Final Summary</h4>
          <div className="space-y-4 mb-6">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-semibold text-emerald-600">160</span>
                <Check className="text-emerald-600" />
              </div>
              <p className="text-sm text-emerald-700">Records Processing Completed</p>
            </div>
            <div className="bg-red-50/50 border border-red-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-semibold text-red-500">160</span>
                <X className="text-red-500" />
              </div>
              <p className="text-sm text-red-600">Records Processing Failed</p>
            </div>
          </div>

          <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-6">
            <div className="w-48 h-48 rounded-full border-16 border-emerald-200">
              <div className="w-full h-full rounded-full border-16 border-red-200 relative">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-semibold">260</span>
                  <span className="text-sm text-gray-500">Total Records</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button 
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              onClick={() => setCurrentStep('finalize')}>
              Review & Edit
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-500 font-medium">Name</th>
              <th className="px-6 py-3 text-left text-gray-500 font-medium">Email</th>
              <th className="px-6 py-3 text-left text-gray-500 font-medium">Department</th>
              <th className="px-6 py-3 text-left text-gray-500 font-medium">Status</th>
              <th className="px-6 py-3 text-left text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tableData.map((row, i) => (
              <tr key={row.id} className="bg-white">
                {editingRow === i ? (
                  <>
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        value={row.name}
                        onChange={(e) => {
                          const newData = [...tableData];
                          newData[i] = { ...row, name: e.target.value };
                          setTableData(newData);
                        }}
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="email" 
                        value={row.email}
                        onChange={(e) => {
                          const newData = [...tableData];
                          newData[i] = { ...row, email: e.target.value };
                          setTableData(newData);
                        }}
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={row.department}
                        onChange={(e) => {
                          const newData = [...tableData];
                          newData[i] = { ...row, department: e.target.value };
                          setTableData(newData);
                        }}
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option>Engineering</option>
                        <option>Marketing</option>
                        <option>Sales</option>
                        <option>HR</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={row.status}
                        onChange={(e) => {
                          const newData = [...tableData];
                          newData[i] = { ...row, status: e.target.value };
                          setTableData(newData);
                        }}
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4">{row.name}</td>
                    <td className="px-6 py-4">{row.email}</td>
                    <td className="px-6 py-4">{row.department}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.status === 'Active' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </>
                )}
                <td className="px-6 py-4">
                  {editingRow === i ? (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setEditingRow(null)}
                        className="text-success hover:text-success/80">
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => setEditingRow(null)}
                        className="text-destructive hover:text-destructive/80">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setEditingRow(i)}
                      className="text-primary hover:text-primary/80">
                      <Pencil size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
