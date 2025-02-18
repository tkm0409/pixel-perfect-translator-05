// src/pages/Index.tsx
import { useState } from 'react';
import { toast } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';
import StepsIndicator from '@/components/upload/StepsIndicator';
import UploadSection from '@/components/upload/UploadSection';
import ProcessingSection from '@/components/upload/ProcessingSection';
import ReviewSection from '@/components/upload/ReviewSection';
import { processExcelFile, ProcessedData } from '@/utils/excelProcessor';

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
      // Process each file
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
      // Here you would typically send the data to your backend
      // toast.success('Data successfully submitted!');
      setCurrentStep('upload');
      setFiles([]);
      setProgress(0);
      setProcessedData(null);
    } else {
      toast.error('Please resolve all errors before submitting');
    }
  };

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
          // src/pages/Index.tsx (continued)
          onDrop={handleDrop}
          onFileSelect={handleFiles}
          onRemoveFile={(index) => setFiles(files.filter((_, i) => i !== index))}
          onProcess={processFiles}
        />
      )}

      {currentStep === 'process' && (
        <ProcessingSection
          progress={progress}
          summary={{
            completed: processedData?.rows.length ?? 0,
            processing: files.length
          }}
          onCancel={() => {
            setCurrentStep('upload');
            setProcessing(false);
            setProgress(0);
          }}
        />
      )}

      {currentStep === 'review' && processedData && (
        <ReviewSection
          onGoBack={() => setCurrentStep('review')}
          onSubmit={handleSubmit}
          data={processedData}
          onDataUpdate={handleDataUpdate}
        />
      )}
    </AppLayout>
  );
};

export default Index;