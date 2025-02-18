// src/types/index.ts
export interface ProcessingSummary {
    completed: number;
    processing: number;
  }
  
  export interface ReviewSummary {
    noChanges: number;
    manuallyEdited: number;
    errorsRemaining: number;
    blankFields: number;
  }
  
  export interface FileWithPreview extends File {
    preview?: string;
  }