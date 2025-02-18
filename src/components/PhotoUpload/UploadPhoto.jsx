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
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="mt-2"
      />
    </div>
  );
};

export default PhotoUpload;
