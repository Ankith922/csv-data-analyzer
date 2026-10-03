import { useState, useRef } from 'react';
import { UploadCloud, FileType, CheckCircle2, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function UploadBox({ onUpload, isLoading, error }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile.name.endsWith('.csv')) {
      alert('Only .csv files are supported');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10 MB');
      return;
    }
    setFile(selectedFile);
  };

  const submitUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div className="text-red-700 text-sm">{error}</div>
        </div>
      )}

      <div
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 transition-all text-center",
          dragActive ? "border-primary bg-blue-50" : "border-slate-300 bg-white hover:bg-slate-50",
          file && "border-emerald-500 bg-emerald-50/30"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
        />

        {!file ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <UploadCloud className="h-8 w-8 text-slate-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Upload your CSV</h3>
              <p className="text-sm text-slate-500 mt-1">Drag and drop your file here, or click to browse</p>
            </div>
            <p className="text-xs text-slate-400">Maximum file size: 10 MB • Only .csv files</p>
            <button
              onClick={() => inputRef.current?.click()}
              className="mt-4 px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium shadow-sm"
            >
              Browse file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-emerald-100">
              <FileType className="h-8 w-8 text-emerald-500" />
              <div className="text-left">
                <p className="font-medium text-slate-900 flex items-center gap-2">
                  {file.name}
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </p>
                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setFile(null)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submitUpload}
                disabled={isLoading}
                className={cn(
                  "px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center gap-2",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Analyze Dataset"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-slate-500 animate-pulse">Reading CSV...</p>
          <p className="text-sm text-slate-500 animate-pulse" style={{ animationDelay: '300ms' }}>Analyzing columns...</p>
          <p className="text-sm text-slate-500 animate-pulse" style={{ animationDelay: '600ms' }}>Generating insights...</p>
        </div>
      )}
    </div>
  );
}
