import React from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import './AddRecipeScreen.css'; 
import CameraComponent from '@/components/Photo/CameraComponent/cameraComponent';

function AddRecipeScreen() {

  return (
    <div className="container">
      {/* <button 
        className="button"
        onClick={() => navigate("/cameraComponent")} // Navigate to /cameraComponent
      >
        <CameraAltIcon /> Use Camera
      </button> */}
      <CameraComponent/>
    </div>
  );
}

export default AddRecipeScreen;
