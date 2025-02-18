// src/constants/index.ts
export const ACCEPTED_FILE_TYPES = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.ms-excel', // xls
    'text/csv', // csv
  ];
  
  export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  
  export const STEPS = [
    { id: 'upload', label: 'Upload File', icon: 'Upload' },
    { id: 'process', label: 'Process Data', icon: 'FileText' },
    { id: 'review', label: 'Review & Edit', icon: 'Check' },
    { id: 'finalize', label: 'Finalise & Submit', icon: 'Check' },
  ] as const;
  
  export const CLIENTS = [
    { id: 'abbott', name: 'Abbott' },
    { id: 'other', name: 'Other Client' },
  ] as const;