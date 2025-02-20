import { Upload, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepsIndicatorProps {
  currentStep: string;
}

const StepsIndicator = ({ currentStep }: StepsIndicatorProps) => {
  const steps = [
    { id: 'upload', label: 'Upload File', icon: Upload, number: 1 },
    { id: 'process', label: 'Process Data', icon: FileText, number: 2 },  
    { id: 'review', label: 'Review & Edit', icon: Check, number: 3 },
    { id: 'finalize', label: 'Finalise & Submit', icon: Check, number: 4 },
  ];

  return (
    <div className="w-full bg-white">
      <div className="flex items-center gap-8">
        {/* Abbott Container */}
        <div className="bg-blue-50 py-2 px-6 rounded-lg">
          <span className="text-blue-900 font-medium">Abbott</span>
        </div>

        {/* Steps Container */}
        <div className="flex items-center flex-1">
          {steps.map((step, index) => {
             const StepIcon = step.icon;
             const isActive = currentStep === step.id;
             const isCompleted = steps.findIndex(s => s.id === currentStep) > 
                                steps.findIndex(s => s.id === step.id);

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                {/* Step Circle */}
                <div className="flex items-center flex-1">
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full",
                    isCompleted ? "bg-emerald-500" :
                      isActive ? "bg-blue-400" :
                        "bg-gray-300",
                  )}>
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <span className={cn(
                        "text-sm",
                        isActive ? "text-white" : "text-gray-600"
                      )}>
                        {step.number}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span className="ml-2 text-sm text-gray-600">
                    {step.label}
                  </span>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "h-[1px] flex-1 mx-4",
                      isCompleted ? "bg-emerald-500" : "bg-gray-200"
                    )} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepsIndicator;