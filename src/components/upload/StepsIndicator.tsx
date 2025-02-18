// src/components/upload/StepsIndicator.tsx
import { Upload, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepsIndicatorProps {
  currentStep: string;
}

const steps = [
  { id: 'upload', label: 'Upload File', icon: Upload },
  { id: 'process', label: 'Process Data', icon: FileText },
  { id: 'review', label: 'Review & Edit', icon: Check },
  { id: 'finalize', label: 'Finalise & Submit', icon: Check },
];

const StepsIndicator = ({ currentStep }: StepsIndicatorProps) => {
  return (
    <div className="flex items-center justify-between mb-12">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = steps.findIndex(s => s.id === currentStep) > 
                           steps.findIndex(s => s.id === step.id);
        
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                isCompleted ? "bg-emerald-500 text-white" :
                isActive ? "bg-primary text-white" :
                "bg-gray-100 text-gray-400"
              )}>
                <StepIcon size={20} />
              </div>
              <span className="text-sm text-gray-600">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-32 h-[2px]",
                isCompleted ? "bg-emerald-500" : "bg-gray-200",
                "mx-4"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepsIndicator;