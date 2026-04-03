import React from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const FileUpload = ({ onFileSelect, disabled }: FileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      onFileSelect(file);
      e.target.value = "";
    }
  };

  return (
  <div className="px-1 flex items-center">
    <label
      htmlFor="file-upload-input"
      className="flex items-center gap-2 px-3 py-2 bg-brand-surface hover:bg-brand-card text-brand-muted hover:text-white rounded-full text-sm font-medium transition-all duration-200 border border-brand-border-light cursor-pointer whitespace-nowrap"
    >
      <span>📎</span>
      <span>File</span>

      <input
        type="file"
        id="file-upload-input"
        name="file-upload"
        accept=".pdf,.txt,.docx,.pptx,.png,.jpg,.jpeg"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
    </label>
  </div>
);
};

export default FileUpload;