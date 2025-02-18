// src/components/upload/ProcessingSection.tsx
import { Check, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProcessingSectionProps {
  progress: number;
  summary: {
    completed: number;
    processing: number;
  };
  onCancel: () => void;
}

const ProcessingSection = ({ progress, summary, onCancel }: ProcessingSectionProps) => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-sm">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-12">
          <div className="w-20 h-20 mx-auto mb-6">
            <div className="w-full h-full rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          </div>
          <h3 className="text-xl font-medium mb-3">Processing Your Data...</h3>
          <p className="text-gray-600">
            Our AI model is checking for errors, mapping data fields, and applying corrections. 
            You will see a detailed breakdown once processing is complete.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-emerald-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-semibold text-emerald-600">
                {summary.completed}
              </span>
              <Check className="text-emerald-600" />
            </div>
            <p className="text-sm text-emerald-700">Records Processing Completed</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-semibold text-primary">
                {summary.processing}
              </span>
              <Clock className="text-primary" />
            </div>
            <p className="text-sm text-primary">Records Processing</p>
          </div>
        </div>

        <Progress value={progress} className="h-2 mb-4" />
        <p className="text-sm text-gray-500">{progress}% Complete</p>

        <button 
          onClick={onCancel}
          className="mt-8 px-6 py-2 border border-gray-200 rounded-lg"
        >
          Cancel Processing
        </button>
      </div>
    </div>
  );
};

export default ProcessingSection;