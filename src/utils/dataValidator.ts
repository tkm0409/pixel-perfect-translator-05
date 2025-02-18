// src/utils/dataValidator.ts
export interface ValidationRule {
    type: 'required' | 'format' | 'range' | 'custom';
    message: string;
    validate: (value: any) => boolean;
  }
  
  export interface ColumnValidation {
    [columnName: string]: ValidationRule[];
  }
  
  export interface ValidationError {
    row: number;
    column: string;
    message: string;
  }
  
  export const validateData = (
    data: Record<string, string>[],
    validationRules: ColumnValidation
  ): ValidationError[] => {
    const errors: ValidationError[] = [];
  
    data.forEach((row, rowIndex) => {
      Object.keys(validationRules).forEach(column => {
        const value = row[column];
        const rules = validationRules[column];
  
        rules.forEach(rule => {
          if (!rule.validate(value)) {
            errors.push({
              row: rowIndex,
              column,
              message: rule.message
            });
          }
        });
      });
    });
  
    return errors;
  };
  
  export const commonValidationRules: Record<string, ValidationRule> = {
    required: {
      type: 'required',
      message: 'This field is required',
      validate: (value: any) => value !== undefined && value !== null && value !== ''
    },
    number: {
      type: 'format',
      message: 'Must be a valid number',
      validate: (value: any) => !isNaN(Number(value))
    },
    email: {
      type: 'format',
      message: 'Must be a valid email address',
      validate: (value: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    },
    date: {
      type: 'format',
      message: 'Must be a valid date',
      validate: (value: any) => !isNaN(Date.parse(value))
    }
  };