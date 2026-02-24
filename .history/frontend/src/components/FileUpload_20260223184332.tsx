const FileUpload = () => {
  return (
    <div style={{ padding: "10px 20px" }}>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
      />
    </div>
  );
};

export default FileUpload;