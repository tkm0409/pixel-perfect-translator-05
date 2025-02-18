// src/utils/dataProcessor.ts
import * as XLSX from 'xlsx';

export interface ColumnConfig {
  title: string;
  key: string;
  isBold?: boolean;
  validations?: {
    type: 'required' | 'format' | 'range' | 'custom';
    message: string;
    validate: (value: any) => boolean;
  }[];
}

export interface ProcessedData {
  columns: ColumnConfig[];
  rows: Record<string, any>[];
  errors: {
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
  }[];
}

export const processExcelFile = async (file: File): Promise<ProcessedData> => {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Get headers and create column configs
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
    const headers: string[] = [];
    
    for (let C = range.s.c; C <= range.e.c; C++) {
      const address = XLSX.utils.encode_cell({ r: range.s.r, c: C });
      const cell = worksheet[address];
      headers.push(cell?.v || `Column ${C + 1}`);
    }

    const columns: ColumnConfig[] = headers.map((header, index) => ({
      title: header,
      key: `col${index}`,
      isBold: index === 0 // First column is typically bold
    }));

    // Convert worksheet to JSON data
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: headers });
    
    // Process rows and detect errors
    const processedRows: Record<string, any>[] = [];
    const errors: ProcessedData['errors'] = [];

    rawData.forEach((row: any, rowIndex) => {
      const processedRow: Record<string, any> = {};
      
      headers.forEach((header, colIndex) => {
        const value = row[header];
        processedRow[`col${colIndex}`] = value?.toString() || '';
        
        // Validate data and collect errors
        if (!value && colIndex === 0) {
          errors.push({
            row: rowIndex,
            column: `col${colIndex}`,
            message: 'Required field is empty',
            details: {
              mappingSheet: 'Mapping Sheet',
              columnInfo: `Column ${colIndex + 1}: "${header}"`,
              rowInfo: `Row ${rowIndex + 1}: Empty value`,
              description: 'This field cannot be empty'
            },
            suggestions: {
              fix: 'Please enter a valid value for this required field',
              example: 'Enter appropriate data based on the column requirements'
            }
          });
        }
      });

      processedRows.push(processedRow);
    });

    return {
      columns,
      rows: processedRows,
      errors
    };
  } catch (error) {
    throw new Error(`Error processing Excel file: ${(error as Error).message}`);
  }
};