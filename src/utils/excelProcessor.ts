// src/utils/excelProcessor.ts
import * as XLSX from 'xlsx';

export interface ProcessedData {
  headers: string[];
  rows: Record<string, string>[];
  summary: {
    noChanges: number;
    manuallyEdited: number;
    errorsRemaining: number;
    blankFields: number;
  };
}

export const processExcelFile = async (file: File): Promise<ProcessedData> => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // Convert to JSON while preserving header row
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  if (jsonData.length === 0) {
    throw new Error('File is empty');
  }

  // Extract headers from first row
  const headers = jsonData[0] as string[];
  
  // Process remaining rows
  const rows = jsonData.slice(1).map((row: any) => {
    const rowData: Record<string, string> = {};
    headers.forEach((header, index) => {
      rowData[header] = row[index]?.toString() || '';
    });
    return rowData;
  });

  // Analyze data quality
  const summary = analyzeData(rows, headers);

  return {
    headers,
    rows,
    summary
  };
};

const analyzeData = (rows: Record<string, string>[], headers: string[]) => {
  let noChanges = 0;
  let manuallyEdited = 0;
  let errorsRemaining = 0;
  let blankFields = 0;

  rows.forEach(row => {
    const hasBlankFields = headers.some(header => !row[header]);
    const hasErrors = headers.some(header => {
      const value = row[header];
      return value && (
        (typeof value === 'string' && value.includes('ERROR')) ||
        (typeof value === 'string' && value.includes('#'))
      );
    });

    if (hasBlankFields) {
      blankFields++;
    } else if (hasErrors) {
      errorsRemaining++;
    } else {
      noChanges++;
    }
  });

  return {
    noChanges,
    manuallyEdited: 0, // This will be updated as users make edits
    errorsRemaining,
    blankFields
  };
};