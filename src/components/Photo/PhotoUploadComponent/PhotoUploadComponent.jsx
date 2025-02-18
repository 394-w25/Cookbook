import React from 'react';

const PhotoUploadComponent = ({ onUpload, onError }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result);
      };
      reader.onerror = () => {
        onError('Error uploading the file. Please try again.');
      };
      reader.readAsDataURL(file);
    } else {
      onError('No file selected.');
    }
  };

  return (
    <div className="photo-upload-container">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        id="file-upload"
        style={{ display: 'none' }}
      />

      <label htmlFor="file-upload" className="upload-button">
        Upload Photo
      </label>
    </div>
  );
};

export default PhotoUploadComponent;
