import React from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const FileUpload = ({ onFileSelect, disabled }: FileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Grab the first file the user selected
    const file = e.target.files?.[0];
    
    if (file) {
      onFileSelect(file);
      // Reset the input value so the user can upload the same file again if needed
      e.target.value = "";
    }
  };

  return (
    <div className="file-upload-container" style={{ padding: "10px 20px" }}>
      <input
        type="file"
        id="file-upload-input"
        name="file-upload"
        accept=".pdf,.txt,.docx"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
};

export default FileUpload;