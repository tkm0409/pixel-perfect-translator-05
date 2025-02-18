import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X, AlertCircle } from "lucide-react";

interface EditFieldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingCell: {
    value: string;
    rowIndex: number;
    columnName: string;
  } | null;
  onSave: () => void;
  onChange: (value: string) => void;
}

const EditFieldDialog = ({
  isOpen,
  onClose,
  editingCell,
  onSave,
  onChange,
}: EditFieldDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[480px] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-lg font-semibold">Edit Field</DialogTitle>
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="space-y-6">
            {/* Column Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Column heading
              </label>
              <Input
                value={editingCell?.value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Error Details */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-sm font-medium">Error Details</span>
              </div>

              <div className="text-sm">
                <div className="text-gray-600 mb-1">Mapping Sheet</div>
                <div className="pl-4 text-gray-600 mb-1">
                  Column 01: "Column heading"
                </div>
                <div className="pl-4">
                  <span className="text-red-600">Row 50: "Bold text column"</span>
                  <div className="text-gray-500 text-xs mt-1">
                    (Assignment State does not match the selected Program Type.)
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💡</span>
                <span className="font-medium">Suggestions</span>
              </div>
              <div className="space-y-3">
                <div className="pl-6 text-sm text-blue-900">
                  <span className="text-blue-500">•</span> Fix: Select the correct Assignment State from the dropdown that aligns with the selected Program Type.
                </div>
                <div className="pl-6 text-sm text-gray-600">
                  <span className="text-gray-400">•</span> Example: If the Program Type is "Full-Time Employment," the Assignment State should be "Active" instead of "Contract Ended."
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 text-sm bg-blue-700 text-white rounded-md hover:bg-blue-800"
            >
              Save
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditFieldDialog;