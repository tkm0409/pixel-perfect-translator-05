// src/utils/file.ts
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '@/constants';

export const validateFile = (file: File) => {
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not supported. Please upload Excel or CSV files only.'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 10MB.'
    };
  }

  return { valid: true, error: null };
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const parseExcelData = async (file: File) => {
  // Implementation for parsing Excel/CSV data
  // This would use libraries like xlsx to parse the actual data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: []
      });
    }, 1000);
  });
};