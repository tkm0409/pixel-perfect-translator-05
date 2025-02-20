import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Pencil, Edit2, PenBoxIcon } from 'lucide-react';
import EditFieldDialog from './EditFieldDialog';

interface DataTableProps {
  headers: string[];
  rows: Record<string, string>[];
  onDataUpdate: (updatedRows: Record<string, string>[]) => void;
}

const DataTable = ({ headers, rows, onDataUpdate }: DataTableProps) => {
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    columnName: string;
    value: string;
  } | null>(null);

  const [inlineEditingCell, setInlineEditingCell] = useState<{
    rowIndex: number;
    columnName: string;
    value: string;
  } | null>(null);

  const [hoveredCell, setHoveredCell] = useState<{
    rowIndex: number;
    columnName: string;
  } | null>(null);

  const handleCellEdit = (rowIndex: number, columnName: string, value: string) => {
    setEditingCell({ rowIndex, columnName, value });
  };

  const handleInlineCellEdit = (rowIndex: number, columnName: string, value: string) => {
    setInlineEditingCell({ rowIndex, columnName, value });
  };

  const handleSaveCellEdit = () => {
    if (editingCell) {
      const updatedRows = [...rows];
      updatedRows[editingCell.rowIndex] = {
        ...updatedRows[editingCell.rowIndex],
        [editingCell.columnName]: editingCell.value
      };
      onDataUpdate(updatedRows);
      setEditingCell(null);
      toast.success('Cell updated successfully');
    }
  };

  const handleInlineEditSave = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inlineEditingCell) {
      const updatedRows = [...rows];
      updatedRows[inlineEditingCell.rowIndex] = {
        ...updatedRows[inlineEditingCell.rowIndex],
        [inlineEditingCell.columnName]: inlineEditingCell.value
      };
      onDataUpdate(updatedRows);
      setInlineEditingCell(null);
      toast.success('Cell updated successfully');
    } else if (e.key === 'Escape') {
      setInlineEditingCell(null);
    }
  };

  const renderCell = (rowIndex: number, columnName: string, value: string) => {
    if (
      inlineEditingCell?.rowIndex === rowIndex &&
      inlineEditingCell?.columnName === columnName
    ) {
      return (
        <Input
          value={inlineEditingCell.value}
          onChange={(e) =>
            setInlineEditingCell({ ...inlineEditingCell, value: e.target.value })
          }
          onKeyDown={handleInlineEditSave}
          autoFocus
          className="w-full h-8 px-2"
        />
      );
    }

    return (
      <div className="flex items-center justify-between">
        <span className={value.includes('text column') ? 'text-gray-500' : ''}>
          {value}
        </span>
        {hoveredCell?.rowIndex === rowIndex && hoveredCell?.columnName === columnName && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <div 
              className="bg-blue-800 p-2 rounded-lg cursor-pointer hover:bg-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                handleCellEdit(rowIndex, columnName, value);
              }}
            >
              <Pencil className="h-4 w-4 text-white" />
            </div>
            <div 
              className="bg-green-600 p-2 rounded-lg cursor-pointer hover:bg-green-500"
              onClick={(e) => {
                e.stopPropagation();
                handleInlineCellEdit(rowIndex, columnName, value);
              }}
            >
              <PenBoxIcon className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3 text-left text-gray-500 font-medium">
                {header}
                <span className="ml-2 inline-block">↓</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white">
              {headers.map((header, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  className="px-6 py-4 relative group cursor-pointer hover:bg-gray-50"
                  onMouseEnter={() => setHoveredCell({ rowIndex, columnName: header })}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {renderCell(rowIndex, header, row[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <EditFieldDialog
        isOpen={editingCell !== null}
        onClose={() => setEditingCell(null)}
        editingCell={editingCell}
        onSave={handleSaveCellEdit}
        onChange={(value) =>
          setEditingCell(editingCell ? { ...editingCell, value } : null)
        }
      />
    </div>
  );
};

export default DataTable;