import React, { useState } from 'react';

const PhotoUpload = ({ onUpload, onError }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result); // Call onUpload with the base64 string
      };
      reader.onerror = () => {
        onError('Error uploading the file. Please try again.');
      };
      reader.readAsDataURL(file); // Read the file as base64 data URL
    } else {
      onError('No file selected.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* File Input hidden */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        id="file-upload"
        style={{ display: 'none' }} // Hide the default file input
      />

      {/* Custom Button */}
      <label htmlFor="file-upload" className="custom-file-upload">
        Click Here to Upload Photo
      </label>
    </div>
  );
};

export default PhotoUpload;
