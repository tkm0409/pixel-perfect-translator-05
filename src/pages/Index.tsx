import { useState } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import AppLayout from '@/components/layout/AppLayout';
import StepsIndicator from '@/components/upload/StepsIndicator';
import UploadSection from '@/components/upload/UploadSection';
import ProcessingSection from '@/components/upload/ProcessingSection';
import ReviewSection from '@/components/upload/ReviewSection';

interface ProcessedData {
  headers: string[];
  rows: Record<string, string>[];
  summary: {
    noChanges: number;
    manuallyEdited: number;
    errorsRemaining: number;
    blankFields: number;
  };
}

interface ProcessingSummary {
  recordsCompleted: number;
  recordsFailed: number;
  recordsProcessing: number;
  estimatedTimeRemaining: number;
  totalRecords: number;
}


const Index = () => {
  const [currentStep, setCurrentStep] = useState('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [processingSummary, setProcessingSummary] = useState<ProcessingSummary>({
    recordsCompleted: 0,
    recordsFailed: 0,
    recordsProcessing: 0,
    estimatedTimeRemaining: 0,
    totalRecords: 0
  });

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

  const processFile = async (file: File): Promise<{
    rows: Record<string, string>[];
    headers: string[];
    errorCount: number;
    blankCount: number;
  }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1).map(row => {
            const record: Record<string, string> = {};
            headers.forEach((header, index) => {
              record[header] = (row[index] || '').toString();
            });
            return record;
          });

          // Count errors and blank fields
          let errorCount = 0;
          let blankCount = 0;
          rows.forEach(row => {
            Object.values(row).forEach(value => {
              if (!value) blankCount++;
              if (value && !validateField(value)) errorCount++;
            });
          });

          resolve({ rows, headers, errorCount, blankCount });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsArrayBuffer(file);
    });
  };

  const validateField = (value: string): boolean => {
    // Add your field validation logic here
    return true;
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
      let totalRows = 0;
      let processedRows = 0;
      let errorCount = 0;
      let blankCount = 0;
      const allRows: Record<string, string>[] = [];
      let headers: string[] = [];

      // First pass: count total rows
      for (const file of files) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        totalRows += jsonData.length - 1; // Subtract 1 for header row
      }

      setProcessingSummary(prev => ({
        ...prev,
        totalRecords: totalRows,
        recordsProcessing: totalRows,
        estimatedTimeRemaining: Math.ceil(totalRows * 0.05) // Estimate 0.05 seconds per record
      }));

      // Second pass: process files
      for (const file of files) {
        const result = await processFile(file);
        
        if (headers.length === 0) headers = result.headers;
        allRows.push(...result.rows);
        processedRows += result.rows.length;
        errorCount += result.errorCount;
        blankCount += result.blankCount;

        // Update progress and summary
        const progress = (processedRows / totalRows) * 100;
        setProgress(progress);
        
        setProcessingSummary({
          recordsCompleted: processedRows - errorCount,
          recordsFailed: errorCount,
          recordsProcessing: totalRows - processedRows,
          estimatedTimeRemaining: Math.ceil((totalRows - processedRows) * 0.05),
          totalRecords: totalRows
        });
      }

      // Set final processed data
      setProcessedData({
        headers,
        rows: allRows,
        summary: {
          noChanges: processedRows - errorCount - blankCount,
          manuallyEdited: 0,
          errorsRemaining: errorCount,
          blankFields: blankCount
        }
      });

      setProgress(100);
      // Don't automatically move to review - wait for user to click "Review & Edit"
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
          manuallyEdited: processedData.summary.manuallyEdited + 1,
          errorsRemaining: Math.max(0, processedData.summary.errorsRemaining - 1)
        }
      });
    }
  };

  const handleSubmit = () => {
    if (processedData?.summary.errorsRemaining === 0) {
      // Here you would send the data to your backend
      setCurrentStep('upload');
      setFiles([]);
      setProgress(0);
      setProcessedData(null);
      setProcessingSummary({
        recordsCompleted: 0,
        recordsFailed: 0,
        recordsProcessing: 0,
        estimatedTimeRemaining: 0,
        totalRecords: 0
      });
    } else {
      toast.error('Please resolve all errors before submitting');
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8 mt-6">
        <select className="bg-blue-50 text-primary px-4 py-2 rounded-lg font-medium">
          <option>Abbott</option>
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
        <ProcessingSection
          isComplete={!processing && progress === 100}
          progress={progress}
          summary={processingSummary}
          onCancel={() => {
            setCurrentStep('upload');
            setProcessing(false);
            setProgress(0);
            setProcessingSummary({
              recordsCompleted: 0,
              recordsFailed: 0,
              recordsProcessing: 0,
              estimatedTimeRemaining: 0,
              totalRecords: 0
            });
          }}
          onContinue={() => setCurrentStep('review')}
        />
      )}

      {currentStep === 'review' && processedData && (
        <ReviewSection
          onGoBack={() => setCurrentStep('process')}
          onSubmit={handleSubmit}
          data={processedData}
          onDataUpdate={handleDataUpdate}
        />
      )}
    </AppLayout>
  );
};

export default Index;