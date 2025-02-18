// src/services/fileProcessingService.ts
import * as XLSX from 'xlsx';
import { ProcessedData } from '@/utils/dataProcessor';

interface ValidationRule {
  type: 'required' | 'format' | 'custom';
  message: string;
  validate: (value: any) => boolean;
}

export class FileProcessingService {
  private validationRules: Record<string, ValidationRule[]> = {
    col0: [
      {
        type: 'required',
        message: 'This field is required',
        validate: (value: any) => value !== undefined && value !== null && value !== ''
      }
    ]
  };

  async processFile(file: File): Promise<ProcessedData> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Get the range of the worksheet
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
    
    // Extract headers
    const headers: string[] = [];
    for (let C = range.s.c; C <= range.e.c; C++) {
      const address = XLSX.utils.encode_cell({ r: range.s.r, c: C });
      const cell = worksheet[address];
      headers.push(cell?.v || `Column ${C + 1}`);
    }

    // Create column configurations
    const columns = headers.map((header, index) => ({
      title: header,
      key: `col${index}`,
      isBold: index === 0
    }));

    // Process data rows
    const rows: Record<string, any>[] = [];
    const errors: ProcessedData['errors'] = [];

    for (let R = range.s.r + 1; R <= range.e.r; R++) {
      const row: Record<string, any> = {};
      
      for (let C = range.s.c; C <= range.e.c; C++) {
        const address = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[address];
        const columnKey = `col${C}`;
        const value = cell?.v?.toString() || '';
        
        row[columnKey] = value;

        // Validate cell value
        if (this.validationRules[columnKey]) {
          this.validationRules[columnKey].forEach(rule => {
            if (!rule.validate(value)) {
              errors.push({
                row: R - 1,
                column: columnKey,
                message: rule.message,
                details: {
                  mappingSheet: 'Mapping Sheet',
                  columnInfo: `Column ${C + 1}: "${headers[C]}"`,
                  rowInfo: `Row ${R}: "${value}"`,
                  description: rule.message
                },
                suggestions: {
                  fix: 'Please enter a valid value that meets the requirements',
                  example: 'Enter a non-empty value that matches the expected format'
                }
              });
            }
          });
        }
      }
      
      rows.push(row);
    }

    return {
      columns,
      rows,
      errors
    };
  }
}

export const fileProcessingService = new FileProcessingService();