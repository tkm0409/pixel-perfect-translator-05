// src/hooks/useExcelProcessor.ts
import { useState } from 'react';
import { ProcessedData, processExcelFile } from '@/utils/excelProcessor';
import { toast } from 'sonner';

interface UseExcelProcessor {
  processFiles: (files: File[]) => Promise<ProcessedData | null>;
  processing: boolean;
  progress: number;
}

export const useExcelProcessor = (): UseExcelProcessor => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processFiles = async (files: File[]): Promise<ProcessedData | null> => {
    if (files.length === 0) {
      toast.error('No files to process');
      return null;
    }

    setProcessing(true);
    setProgress(0);

    try {
      let combinedData: ProcessedData | null = null;

      for (let i = 0; i < files.length; i++) {
        const currentProgress = (i / files.length) * 100;
        setProgress(currentProgress);

        const fileData = await processExcelFile(files[i]);

        if (!combinedData) {
          combinedData = fileData;
        } else {
          // Merge data from multiple files
          combinedData = {
            headers: combinedData.headers,
            rows: [...combinedData.rows, ...fileData.rows],
            summary: {
              noChanges: combinedData.summary.noChanges + fileData.summary.noChanges,
              manuallyEdited: combinedData.summary.manuallyEdited + fileData.summary.manuallyEdited,
              errorsRemaining: combinedData.summary.errorsRemaining + fileData.summary.errorsRemaining,
              blankFields: combinedData.summary.blankFields + fileData.summary.blankFields,
            }
          };
        }
      }

      setProgress(100);
      return combinedData;
    } catch (error) {
      toast.error('Error processing files: ' + (error as Error).message);
      return null;
    } finally {
      setProcessing(false);
    }
  };

  return {
    processFiles,
    processing,
    progress
  };
};