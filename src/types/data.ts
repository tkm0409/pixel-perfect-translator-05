// src/types/data.ts
export interface ProcessedData {
    headers: string[];
    columns: ColumnConfig[];
    rows: Record<string, string>[];
    errors: DataError[];
    summary: {
      noChanges: number;
      manuallyEdited: number;
      errorsRemaining: number;
      blankFields: number;
    };
  }
  
  export interface ColumnConfig {
    title: string;
    key: string;
    isBold?: boolean;
  }
  
  export interface DataError {
    row: number;
    column: string;
    message: string;
    details?: {
      mappingSheet?: string;
      columnInfo?: string;
      rowInfo?: string;
      description?: string;
    };
    suggestions?: {
      fix?: string;
      example?: string;
    };
  }