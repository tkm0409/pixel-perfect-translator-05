// src/pages/Index.tsx
import { useState } from 'react';
import { toast } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';
import StepsIndicator from '@/components/upload/StepsIndicator';
import UploadSection from '@/components/upload/UploadSection';
import ProcessingSection from '@/components/upload/ProcessingSection';
import ReviewSection from '@/components/upload/ReviewSection';
import { processExcelFile, ProcessedData } from '@/utils/excelProcessor';
import { Download, MonitorCheck, CheckCircle2, XCircle, Clock4 } from 'lucide-react';

const Index = () => {
  const [currentStep, setCurrentStep] = useState('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
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

  const processFiles = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    setProcessing(true);
    setCurrentStep('process');
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const progress = (i / files.length) * 100;
        setProgress(progress);

        const data = await processExcelFile(files[i]);
        setProcessedData(data);
      }

      setProgress(100);
      setCurrentStep('review');
    } catch (error) {
      toast.error('Error processing files: ' + (error as Error).message);
      setCurrentStep('upload');
    } finally {
      setProcessing(false);
    }
  };

  const handleDataUpdate = (updatedRows: Record<string, string>[]) => {
    if (processedData) {
      setProcessedData({
        ...processedData,
        rows: updatedRows,
        summary: {
          ...processedData.summary,
          manuallyEdited: processedData.summary.manuallyEdited + 1
        }
      });
    }
  };

  const handleSubmit = () => {
    if (processedData?.summary.errorsRemaining === 0) {
      setCurrentStep('upload');
      setFiles([]);
      setProgress(0);
      setProcessedData(null);
    } else {
      toast.error('Please resolve all errors before submitting');
    }
  };

  const renderProcessingStep = () => (
    <div className="grid grid-cols-[1fr,400px] gap-8 p-8">
      <div className="bg-white rounded-lg p-12 text-center">
        <div className="animate-spin w-12 h-12 mx-auto mb-8">
          <div className="w-full h-full rounded-full border-4 border-blue-100 border-t-blue-500" />
        </div>
        <h3 className="text-xl font-medium mb-3">Processing Your Data...</h3>
        <p className="text-gray-600 mb-8">
          Our AI model is checking for errors, mapping data fields, and<br />
          applying corrections. You will see a detailed breakdown once<br />
          processing is complete.
        </p>
        <button 
          onClick={() => setCurrentStep('upload')}
          className="px-6 py-2.5 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Cancel Processing
        </button>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium mb-6">Runtime Summary</h4>
        
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl font-semibold text-emerald-600">160</span>
            <CheckCircle2 className="text-emerald-600" />
          </div>
          <p className="text-sm text-emerald-700">Records Processing Completed</p>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl font-semibold text-red-500">160</span>
            <XCircle className="text-red-500" />
          </div>
          <p className="text-sm text-red-600">Records Processing Failed</p>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl font-semibold text-gray-700">90</span>
            <MonitorCheck className="text-gray-600" />
          </div>
          <p className="text-sm text-gray-600">Records Processing</p>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl font-semibold text-gray-700">8</span>
            <Clock4 className="text-gray-600" />
          </div>
          <p className="text-sm text-gray-600">Records Processing (min)</p>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="grid grid-cols-[1fr,400px] gap-8 p-8">
      <div className="bg-white rounded-lg p-12">
        <div className="flex items-center gap-8 mb-12">
          <img 
            src="/lovable-uploads/7bc1a9ba-8000-4958-ac68-07a9c6244eb5.png" 
            alt="Data Processing" 
            className="w-64"
          />
          <div>
            <h3 className="text-2xl font-medium mb-3">Data Processing Complete!</h3>
            <p className="text-gray-600">
              AI has successfully processed your data. Below is a<br />
              breakdown of the records. Click on any category to<br />
              review and make changes.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            className="w-full text-left px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            onClick={() => setCurrentStep('review-records')}
          >
            Review Records
          </button>
          <button 
            className="w-full text-left px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            onClick={() => setCurrentStep('edit-errors')}
          >
            Edit or Fix any errors
          </button>
          <button 
            className="w-full text-left px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            onClick={() => setCurrentStep('finalize')}
          >
            Finalise and submit the processed data
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium mb-6">Final Summary</h4>
        
        <div className="space-y-4 mb-8">
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl font-semibold text-emerald-600">160</span>
              <CheckCircle2 className="text-emerald-600" />
            </div>
            <p className="text-sm text-emerald-700">Records Processing Completed</p>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl font-semibold text-red-500">160</span>
              <XCircle className="text-red-500" />
            </div>
            <p className="text-sm text-red-600">Records Processing Failed</p>
          </div>
        </div>

        <div className="aspect-square bg-gray-50 rounded-lg p-8 mb-8">
          <div className="relative w-full h-full">
            <div className="absolute inset-0">
              <div className="w-full h-full rounded-full border-[32px] border-emerald-200" />
              <div className="absolute inset-0">
                <div className="w-full h-full rounded-full border-[32px] border-red-200" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-semibold">260</span>
              <span className="text-sm text-gray-500">Total Records</span>
            </div>
          </div>
        </div>

        <div className="space-y-1 text-sm mb-8">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-200" />
            <span className="text-gray-600">Records Processed</span>
            <span className="ml-auto">0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-200" />
            <span className="text-gray-600">Error Found</span>
            <span className="ml-auto">0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-200" />
            <span className="text-gray-600">Empty Records</span>
            <span className="ml-auto">0</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={() => setCurrentStep('upload')}
            className="px-6 py-2.5 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={() => setCurrentStep('review-records')}
            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Review & Edit
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8 mt-6">
        <select className="bg-blue-50 text-primary px-4 py-2 rounded-lg font-medium">
          <option>Client</option>
          <option>Other Client</option>
        </select>
        <h2 className="text-xl font-semibold">New Data Upload</h2>
      </div>

      <StepsIndicator currentStep={currentStep} />

      {currentStep === 'upload' && (
        <UploadSection
          files={files}
          dragActive={dragActive}
          onDrag={handleDrag}
          onDrop={handleDrop}
          onFileSelect={handleFiles}
          onRemoveFile={(index) => setFiles(files.filter((_, i) => i !== index))}
          onProcess={processFiles}
        />
      )}

      {currentStep === 'process' && (
        renderProcessingStep()
      )}

      {currentStep === 'review' && processedData && (
        renderReviewStep()
      )}
    </AppLayout>
  );
};

export default Index;
