import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';
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

  const [hoveredCell, setHoveredCell] = useState<{
    rowIndex: number;
    columnName: string;
  } | null>(null);

  const handleCellEdit = (rowIndex: number, columnName: string, value: string) => {
    setEditingCell({ rowIndex, columnName, value });
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
                  onClick={() => handleCellEdit(rowIndex, header, row[header])}
                >
                  <div className="flex items-center justify-between">
                    <span className={row[header].includes('text column') ? 'text-gray-500' : ''}>
                      {row[header]}
                    </span>
                    {hoveredCell?.rowIndex === rowIndex &&
                      hoveredCell?.columnName === header && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-blue-800 p-2 rounded-lg cursor-pointer">
                            <Pencil className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                  </div>
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