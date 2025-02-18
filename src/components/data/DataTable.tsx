// src/components/data/DataTable.tsx
import React, { useState } from 'react';
import { ChevronDown, Save, RotateCcw, Undo, Filter, Trash2, Pencil, MoreVertical, X, AlertCircle, LightbulbIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Column {
  title: string;
  key: string;
  isBold?: boolean;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onFilter: () => void;
  onDelete: () => void;
  errorCount?: number;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  onSave,
  onUndo,
  onRedo,
  onFilter,
  onDelete,
  errorCount = 0
}) => {
  const [editingCell, setEditingCell] = useState<{row: number; column: string; value: string} | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const toolbarButtons = [
    { icon: Save, label: 'Save', onClick: onSave },
    { icon: Undo, label: 'Undo', onClick: onUndo },
    { icon: RotateCcw, label: 'Redo', onClick: onRedo },
    { icon: Filter, label: 'Filter', onClick: onFilter },
    { icon: Trash2, label: 'Delete', onClick: onDelete },
  ];

  const handleCellClick = (rowIndex: number, column: string, value: string) => {
    setEditingCell({ row: rowIndex, column, value });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center space-x-4 mb-4">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <button.icon className="w-5 h-5 text-gray-600" />
          </button>
        ))}
        
        {errorCount > 0 && (
          <div className="ml-4 px-3 py-1.5 bg-red-50 text-red-700 rounded-md flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Errors: Total {errorCount} errors found in processed file</span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="w-8 p-3">
                <input 
                  type="checkbox"
                  className="rounded border-gray-300"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(data.map((_, index) => index));
                    } else {
                      setSelectedRows([]);
                    }
                  }}
                />
              </th>
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </th>
              ))}
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                <td className="w-8 p-3">
                  <input 
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedRows.includes(rowIndex)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows([...selectedRows, rowIndex]);
                      } else {
                        setSelectedRows(selectedRows.filter(i => i !== rowIndex));
                      }
                    }}
                  />
                </td>
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex}
                    className={cn(
                      "px-4 py-3 text-sm",
                      column.isBold && "font-semibold",
                      row[column.key]?.includes('error') && "text-red-600"
                    )}
                    onClick={() => handleCellClick(rowIndex, column.key, row[column.key])}
                  >
                    {row[column.key]}
                  </td>
                ))}
                <td className="w-8 p-3">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Edit Field</DialogTitle>
              <button 
                onClick={() => setIsEditDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          {editingCell && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium">Column heading</label>
                <input
                  type="text"
                  value={editingCell.value}
                  className={cn(
                    "mt-2 w-full px-3 py-2 border rounded-md",
                    editingCell.value.includes('error') && "border-red-300 text-red-600"
                  )}
                  onChange={(e) => setEditingCell({
                    ...editingCell,
                    value: e.target.value
                  })}
                />
              </div>

              {editingCell.value.includes('error') && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      Error Details
                    </h4>
                    <div className="pl-6 space-y-1 text-sm text-gray-600">
                      <div>Mapping Sheet</div>
                      <div className="flex items-center gap-2">
                        <span>→</span>
                        <span>Column 01: "Column heading"</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>→</span>
                        <span>Row 50: "<span className="text-red-600">Bold text column</span>"</span>
                      </div>
                      <div className="text-gray-500">(Assignment State does not match the selected Program Type.)</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <LightbulbIcon className="w-4 h-4 text-blue-500" />
                      Suggestions
                    </h4>
                    <div className="pl-6 space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">♦</span>
                        <span>Fix: Select the correct Assignment State from the dropdown that aligns with the selected Program Type.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pencil className="w-4 h-4 text-gray-400" />
                        <span>Example: If the Program Type is "Full-Time Employment," the Assignment State should be "Active" instead of "Contract Ended."</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditDialogOpen(false)}
                  className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataTable;