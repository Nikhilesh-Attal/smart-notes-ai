<<<<<<< HEAD
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
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        onChange={handleFileChange}
        disabled={disabled}
=======
const FileUpload = () => {
  return (
    <div style={{ padding: "10px 20px" }}>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
      />
    </div>
  );
};

export default FileUpload;