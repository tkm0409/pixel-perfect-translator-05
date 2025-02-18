import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadSectionProps {
  files: File[];
  dragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (files: FileList) => void;
  onRemoveFile: (index: number) => void;
  onProcess: () => void;
}

const UploadSection = ({
  files,
  dragActive,
  onDrag,
  onDrop,
  onFileSelect,
  onRemoveFile,
  onProcess
}: UploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex gap-8">
      {/* Left side - Upload area */}
      <div className="flex-1 bg-white rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">File Upload</h3>
          <p className="text-gray-500 text-sm">Add your documents here, and you can upload up to 5 files</p>
        </div>

        <button 
          onClick={handleDropZoneClick}
          className={cn(
            "w-full border border-dashed border-blue-200 rounded-lg bg-blue-50/30 p-12",
            "flex flex-col items-center justify-center",
            "min-h-[240px] cursor-pointer",
            "hover:bg-blue-50/40 transition-colors duration-200",
            dragActive && "border-primary bg-blue-50/50"
          )}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
        >
          <div className="bg-white rounded-full p-4 mb-4">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-gray-600 font-medium mb-1">Drag your file(s) or click to browse</p>
          <p className="text-gray-500 text-sm mb-6">Supported files: xlsx, csv and zip files</p>
          <p className="text-gray-400 text-xs">Maximum Size: 10MB</p>
        </button>

        <div className="mt-6">
          <p className="text-center text-gray-500 mb-4">OR</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Add file URL"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              Upload
            </button>
          </div>
        </div>

        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          multiple 
          accept=".csv,.xlsx,.zip"
          onChange={(e) => e.target.files && onFileSelect(e.target.files)}
        />
      </div>

      {/* Right side - File list */}
      <div className="w-[400px]">
        {files.map((file, index) => (
          <div 
            key={index} 
            className={cn(
              "flex items-center justify-between p-4 rounded-lg mb-3",
              "border border-gray-100",
              file.size > 10 * 1024 * 1024 ? "bg-red-50" : "bg-white"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)}MB</p>
              </div>
            </div>
            <button 
              onClick={() => onRemoveFile(index)}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        ))}

        {files.length > 0 && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => files.forEach((_, i) => onRemoveFile(i))}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onProcess}
              className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800"
            >
              Process Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;