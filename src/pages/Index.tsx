import { useState, useRef } from 'react';
import { Upload, X, Check, Clock, FileText, Loader2, Pencil } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const steps = [
  { id: 'upload', label: 'Upload File', icon: Upload },
  { id: 'process', label: 'Process Data', icon: FileText },
  { id: 'review', label: 'Review & Edit', icon: Check },
  { id: 'finalize', label: 'Finalise & Submit', icon: Check },
];

interface TableRow {
  [key: string]: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [processingSummary, setProcessingSummary] = useState({
    completed: 0,
    failed: 0,
    processing: 0,
    total: 0
  });
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    columnName: string;
    value: string;
  } | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    if (newFiles.some(file => !file.name.match(/\.(xlsx|csv)$/i))) {
      toast.error('Please upload only Excel or CSV files');
      return;
    }
    setFiles(prevFiles => [...prevFiles, ...newFiles].slice(0, 5));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const processFiles = async (files: File[]) => {
    setProcessing(true);
    setCurrentStep('process');
    let progress = 0;

    try {
      const results: TableRow[] = [];
      let headers: string[] = [];
      
      for (const file of files) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 0) {
          if (headers.length === 0) {
            headers = jsonData[0] as string[];
            setHeaders(headers);
          }

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            const rowData: TableRow = {};
            headers.forEach((header, index) => {
              rowData[header] = row[index]?.toString() || '';
            });
            results.push(rowData);
            
            progress = Math.min(((i / jsonData.length) * 100), 100);
            setProgress(progress);
          }
        }
      }

      const total = results.length;
      const completed = results.filter(row => Object.values(row).every(val => val !== '')).length;
      const failed = results.filter(row => Object.values(row).some(val => val === '')).length;

      setProcessingSummary({
        completed,
        failed,
        processing: 0,
        total
      });

      setTableData(results);
      setCurrentStep('review');
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Error processing files. Please check the file format.');
      setCurrentStep('upload');
    } finally {
      setProcessing(false);
    }
  };

  const processData = () => {
    if (files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }
    processFiles(files);
  };

  const handleCellEdit = (rowIndex: number, columnName: string, value: string) => {
    setEditingCell({ rowIndex, columnName, value });
  };

  const handleSaveCellEdit = () => {
    if (editingCell) {
      const newData = [...tableData];
      newData[editingCell.rowIndex] = {
        ...newData[editingCell.rowIndex],
        [editingCell.columnName]: editingCell.value
      };
      setTableData(newData);
      setEditingCell(null);
    }
  };

  const handleSubmitData = () => {
    setShowSuccessDialog(true);
  };

  const renderUploadStep = () => (
    <>
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center"
           onDragEnter={handleDrag}
           onDragLeave={handleDrag}
           onDragOver={handleDrag}
           onDrop={handleDrop}>
        <div className={`transition-all duration-200 ${dragActive ? 'scale-105' : ''}`}>
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload size={24} className="text-accent-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Drag your file(s) or browse</h3>
          <p className="text-gray-500 mb-4">Add your documents here, and you can upload up to 5 files</p>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            multiple 
            accept=".csv,.xlsx"
            onChange={handleFileInputChange}
          />
          <div className="flex flex-col items-center gap-4">
            <input type="text" 
                  placeholder="Add file URL"
                  className="w-full max-w-md mx-auto px-4 py-2 border border-gray-200 rounded-lg" />
            <div className="flex gap-4">
              <button 
                onClick={handleBrowseClick}
                className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Browse Files
              </button>
              <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-8 space-y-4 animate-slide-up">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <FileText size={20} className="text-gray-400" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)}MB</p>
                </div>
              </div>
              <button 
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
          ))}
          <div className="flex justify-end space-x-4">
            <button 
              onClick={() => setFiles([])}
              className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button 
              onClick={processData}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Process Data
            </button>
          </div>
        </div>
      )}
    </>
  );

  const renderProcessingStep = () => (
    <div className="py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6">
            <div className="w-full h-full rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          </div>
          <h3 className="text-2xl font-medium mb-3">Processing Your Data...</h3>
          <p className="text-gray-600 mb-8">
            Processing your files. This may take a few minutes depending on the file size.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-semibold text-emerald-600">{processingSummary.completed}</span>
              <Check className="text-emerald-600" />
            </div>
            <p className="text-sm text-emerald-700">Records Processing Completed</p>
          </div>
          <div className="bg-red-50/50 border border-red-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-semibold text-red-500">{processingSummary.failed}</span>
              <X className="text-red-500" />
            </div>
            <p className="text-sm text-red-600">Records Processing Failed</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-semibold text-gray-700">{processingSummary.processing}</span>
              <Clock className="text-gray-600" />
            </div>
            <p className="text-sm text-gray-600">Records Processing</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-semibold text-gray-700">{processingSummary.total}</span>
              <FileText className="text-gray-600" />
            </div>
            <p className="text-sm text-gray-600">Total Records</p>
          </div>
        </div>

        <Progress value={progress} className="h-2 mb-4" />
        <p className="text-sm text-gray-500 mb-6">{Math.round(progress)}% Complete</p>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="animate-fade-in">
      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="col-span-2">
          <div className="flex items-center space-x-4 mb-6">
            <img src="/lovable-uploads/77a389ed-b170-4c9b-95b1-2f4f5f1ea875.png" alt="Processing Complete" className="w-48" />
            <div>
              <h3 className="text-2xl font-medium mb-2">Data Processing Complete!</h3>
              <p className="text-gray-600">
                Successfully processed {processingSummary.completed} records. 
                {processingSummary.failed > 0 && ` ${processingSummary.failed} records have missing or invalid data.`}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Processing Summary</h4>
          <div className="space-y-4 mb-6">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-semibold text-emerald-600">{processingSummary.completed}</span>
                <Check className="text-emerald-600" />
              </div>
              <p className="text-sm text-emerald-700">Records Processing Completed</p>
            </div>
            <div className="bg-red-50/50 border border-red-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-semibold text-red-500">{processingSummary.failed}</span>
                <X className="text-red-500" />
              </div>
              <p className="text-sm text-red-600">Records With Errors</p>
            </div>
          </div>

          <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-6">
            <div className="w-48 h-48 rounded-full border-16 border-emerald-200">
              <div className="w-full h-full rounded-full border-16 border-red-200 relative">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-semibold">{processingSummary.total}</span>
                  <span className="text-sm text-gray-500">Total Records</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-6 py-3 text-left text-gray-500 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tableData.map((row, i) => (
              <tr key={i} className="bg-white">
                {headers.map((header, j) => (
                  <td 
                    key={j} 
                    className="px-6 py-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleCellEdit(i, header, row[header])}
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <button 
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          onClick={handleSubmitData}>
          Submit Data
        </button>
      </div>

      <Sheet 
        open={editingCell !== null} 
        onOpenChange={(open) => !open && setEditingCell(null)}
      >
        <SheetContent className="w-[400px]">
          <SheetHeader>
            <SheetTitle>Edit Field</SheetTitle>
          </SheetHeader>
          {editingCell && (
            <div className="mt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Column heading</label>
                  <Input
                    value={editingCell.value}
                    onChange={(e) => setEditingCell({
                      ...editingCell,
                      value: e.target.value
                    })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="size-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center">!</span>
                    Error History
                  </div>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                    No previous errors found for this field.
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingCell(null)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCellEdit}
                  className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-success" />
            </div>
            <DialogTitle className="text-center">Submission Successful!</DialogTitle>
            <DialogDescription className="text-center">
              Your data has been successfully submitted.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <h4 className="font-medium mb-2">🎉 What's Next?</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Your data is now saved and ready for further processing.</li>
              <li>• The AI model will learn from your corrections to improve future accuracy.</li>
              <li>• You will receive an email confirmation shortly.</li>
            </ul>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => {
                setShowSuccessDialog(false);
                setCurrentStep('upload');
                setFiles([]);
                setTableData([]);
              }}
              className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
            >
              Upload New File
            </button>
            <button
              className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
            >
              View Submitted Data
            </button>
            <button
              onClick={() => setShowSuccessDialog(false)}
              className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
            >
              Go to Dashboard
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      
      <main className="ml-16 pt-16 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <select className="bg-accent text-accent-foreground px-4 py-2 rounded-lg font-medium">
                <option>Abbott</option>
                <option>Other Client</option>
              </select>
              <h2 className="text-xl font-semibold">New Data Upload</h2>
            </div>

            <div className="flex items-center justify-between mb-12">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = steps.findIndex(s => s.id === currentStep) > 
                                  steps.findIndex(s => s.id === step.id);
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                        ${isActive ? 'bg-primary text-white' : 
                          isCompleted ? 'bg-success text-white' : 
                          'bg-gray-100 text-gray-400'}`}>
                        <StepIcon size={20} />
                      </div>
                      <span className="text-sm text-gray-600">{step.label}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-32 h-[2px] bg-gray-200 mx-4" />
                    )}
                  </div>
                );
              })}
            </div>

            {currentStep === 'upload' && renderUploadStep()}
            {currentStep === 'process' && renderProcessingStep()}
            {currentStep === 'review' && renderReviewStep()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
