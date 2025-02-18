// src/stores/useUploadStore.ts
import { create } from 'zustand';
import { ProcessingSummary, ReviewSummary } from '@/types';

interface UploadStore {
  currentStep: 'upload' | 'process' | 'review' | 'finalize';
  files: File[];
  progress: number;
  processingSummary: ProcessingSummary;
  reviewSummary: ReviewSummary;
  setCurrentStep: (step: 'upload' | 'process' | 'review' | 'finalize') => void;
  setFiles: (files: File[]) => void;
  setProgress: (progress: number) => void;
  setProcessingSummary: (summary: ProcessingSummary) => void;
  setReviewSummary: (summary: ReviewSummary) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 'upload' as const,
  files: [],
  progress: 0,
  processingSummary: {
    completed: 0,
    processing: 0
  },
  reviewSummary: {
    noChanges: 245,
    manuallyEdited: 13,
    errorsRemaining: 3,
    blankFields: 2
  }
};

export const useUploadStore = create<UploadStore>((set) => ({
  ...initialState,
  setCurrentStep: (step) => set({ currentStep: step }),
  setFiles: (files) => set({ files }),
  setProgress: (progress) => set({ progress }),
  setProcessingSummary: (summary) => set({ processingSummary: summary }),
  setReviewSummary: (summary) => set({ reviewSummary: summary }),
  reset: () => set(initialState)
}));