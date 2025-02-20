import { useState, useEffect } from 'react';
import { Check, Clock, XCircle } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import image from '@/assets/server.avif';

// Custom hook for number animation
const useCountAnimation = (endValue: number, duration: number = 1000, start = true) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!start) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;
      
      if (progress < 1) {
        setCount(Math.min(Math.floor(endValue * progress), endValue));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [endValue, duration, start]);
  
  return count;
};

interface ProcessingSummary {
  recordsCompleted: number;
  recordsFailed: number;
  recordsProcessing: number;
  estimatedTimeRemaining: number;
  totalRecords: number;
}

interface ProcessingSectionProps {
  isComplete: boolean;
  progress: number;
  summary: ProcessingSummary;
  onCancel: () => void;
  onContinue: () => void;
}

const ProcessingSection = ({
  isComplete,
  progress,
  summary,
  onCancel,
  onContinue
}: ProcessingSectionProps) => {
  const [showServerScreen, setShowServerScreen] = useState(false);
  
  // Animated counters for processing state
  const animatedCompleted = useCountAnimation(summary.recordsCompleted, 2000, !isComplete);
  const animatedFailed = useCountAnimation(summary.recordsFailed, 2000, !isComplete);
  const animatedProcessing = useCountAnimation(summary.recordsProcessing, 2000, !isComplete);
  const animatedTime = useCountAnimation(Math.ceil(summary.estimatedTimeRemaining / 60), 2000, !isComplete);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isComplete) {
      timeout = setTimeout(() => {
        setShowServerScreen(true);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isComplete]);

  if (!isComplete) {
    return (
      <div className="flex gap-8 mt-8">
        {/* Left side remains the same */}
        <div className="flex-1 bg-white rounded-lg p-8">
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 mb-6">
              <div className="w-full h-full rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
            </div>
            <h3 className="text-xl font-medium mb-4">Processing Your Data...</h3>
            <p className="text-gray-600 text-center max-w-md mb-8">
              Our AI model is checking for errors, mapping data fields, and
              applying corrections. You will see a detailed breakdown once
              processing is complete.
            </p>
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel Processing
            </button>
          </div>
        </div>

        {/* Right side with animated counters */}
        <div className="w-[400px]">
          <h3 className="text-lg font-medium mb-4">Runtime Summary</h3>
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-semibold text-emerald-600">{animatedCompleted}</span>
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm text-emerald-700">Records Processing Completed</p>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-semibold text-red-500">{animatedFailed}</span>
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm text-red-600">Records Processing Failed</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-semibold text-gray-700">{animatedProcessing}</span>
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-sm text-gray-600">Records Processing</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-semibold text-gray-700">{animatedTime} min</span>
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-sm text-gray-600">Estimated Time Remaining</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete && !showServerScreen) {
    // Your existing completion screen code...
    return (
      <div className="flex gap-8 mt-8">
        {/* Left side - Completion status */}
        <div className="flex-1 bg-white rounded-lg p-8">
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <DotLottieReact
              src="https://lottie.host/e5c4ef3e-b6dd-43cd-bfd3-e72f44114739/VuogEbYb2B.lottie"
              loop
              autoplay
            />

            <h3 className="text-xl font-medium mb-2">Data Processing Complete!</h3>
            <h4 className="text-lg font-medium mb-4">Review Summary</h4>
            <p className="text-gray-600 text-center max-w-md mb-8">
              AI has successfully processed your data. Below is a breakdown of the records.
              Click on any category to review and make changes.
            </p>

            <div className="space-y-3 w-full max-w-md">
              <h5 className="font-medium">Next Steps</h5>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                  Review Records
                </button>
                <button className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                  Edit or Fix any errors
                </button>
              </div>
              <button className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                Finalise and submit the processed data
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Final Summary */}
        <div className="w-[400px]">
          <h3 className="text-lg font-medium mb-4">Final Summary</h3>
          <div className="space-y-4 mb-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-semibold text-emerald-600">{summary.recordsCompleted}</span>
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm text-emerald-700">Records Processing Completed</p>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-semibold text-red-500">{summary.recordsFailed}</span>
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm text-red-600">Records Processing Failed</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-semibold text-gray-700">{summary.recordsProcessing}</span>
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-sm text-gray-600">Records Processing</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Server illustration screen
  return (
    <div className="flex gap-8 mt-8">
      {/* Left side - Server illustration and next steps */}
      <div className="flex-1">
        {/* Replace with your server illustration */}
        <img
          src={image}
          alt="Server Illustration"
          className="mb-6 w-72 h-72 object-contain mix-blend-multiply"
        />
        <h2 className="text-xl font-medium mb-2">Data Processing Complete!</h2>
        <h3 className="text-lg mb-4">Review Summary</h3>
        <div className="space-y-2 ml-4">
          <p>✓ Review records.</p>
          <p>✓ Edit or fix any errors.</p>
          <p>✓ Finalise and Submit the processed data.</p>
        </div>
      </div>

      {/* Right side - Final Summary */}
      <div className="w-[400px]">
        <h3 className="text-lg font-medium mb-4">Final Summary</h3>

        <div className="space-y-4 mb-8">
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-emerald-600">{summary.recordsCompleted}</p>
                <p className="text-sm text-emerald-700">Processing of All Records Completed</p>
              </div>
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-red-500">{summary.recordsFailed}</p>
                <p className="text-sm text-red-600">Error Detected</p>
              </div>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">{summary.estimatedTimeRemaining} min</p>
                <p className="text-sm text-gray-600">Was Average Runtime</p>
              </div>
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onContinue}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          >
            Review & Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessingSection;