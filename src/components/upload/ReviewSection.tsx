import { useState } from 'react';
import { Check, X, AlertCircle, Ban } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DataTable from './DataTable';

interface ReviewSectionProps {
  data: {
    headers: string[];
    rows: Record<string, string>[];
    summary: {
      noChanges: number;
      manuallyEdited: number;
      errorsRemaining: number;
      blankFields: number;
    };
  };
  onDataUpdate: (updatedRows: Record<string, string>[]) => void;
  onGoBack: () => void;
  onSubmit: () => void;
}

const ReviewSection = ({ data, onDataUpdate, onGoBack, onSubmit }: ReviewSectionProps) => {
  const { headers, rows, summary } = data;
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSubmit = () => {
    setShowSuccessDialog(true);
  };

  const statusItems = [
    {
      icon: Check,
      label: "No Changes Required",
      value: summary.noChanges,
      bgColor: "bg-success/10",
      textColor: "text-success"
    },
    {
      icon: AlertCircle,
      label: "Manually Edited",
      value: summary.manuallyEdited,
      bgColor: "bg-warning/10",
      textColor: "text-warning"
    },
    {
      icon: X,
      label: "Errors Remaining",
      value: summary.errorsRemaining,
      bgColor: "bg-destructive/10",
      textColor: "text-destructive"
    },
    {
      icon: Ban,
      label: "Blank Fields",
      value: summary.blankFields,
      bgColor: "bg-gray-100",
      textColor: "text-gray-400"
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h3 className="text-2xl font-medium mb-2">Almost Done</h3>
        <p className="text-gray-600">
          You are about to finalize and submit your data. Please carefully 
          review the summary below and submit when ready.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h4 className="text-lg font-medium mb-4">Status</h4>
        
        <div className="space-y-4">
          {statusItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full ${item.bgColor} flex items-center justify-center`}>
                  <item.icon className={`w-4 h-4 ${item.textColor}`} />
                </div>
                <span>{item.label}</span>
              </div>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Data Preview</h3>
        <DataTable 
          headers={headers}
          rows={rows}
          onDataUpdate={onDataUpdate}
        />
      </div>

      <div className="flex justify-start gap-4">
        <button
          onClick={onGoBack}
          className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Go Back & Review
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 text-white bg-primary rounded-md hover:bg-primary/90"
        >
          Submit Data
        </button>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-success" />
            </div>
            <DialogTitle className="text-xl font-semibold mb-2">Submission Successful!</DialogTitle>
            <p className="text-gray-600">Your data has been successfully submitted.</p>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-2">💡 What's Next?</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Your data is now saved and ready for further processing.</li>
              <li>• The AI model will learn from your corrections to improve future accuracy.</li>
              <li>• You will receive an email confirmation shortly.</li>
            </ul>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              onClick={() => {
                setShowSuccessDialog(false);
                onSubmit(); // Only call onSubmit after showing the success dialog
              }}
            >
              Upload New File
            </button>
            <button
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              View Submitted Data
            </button>
            <button
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Go to Dashboard
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewSection;