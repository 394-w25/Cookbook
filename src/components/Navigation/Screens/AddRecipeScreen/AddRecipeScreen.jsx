import React from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import './AddRecipeScreen.css'; 
import { useNavigate } from 'react-router-dom';

function AddRecipeScreen() {
const navigate = useNavigate();

  return (
    <div className="container">
      <button 
        className="button"
        onClick={() => navigate("/cameraComponent")} // Navigate to /cameraComponent
      >
        <CameraAltIcon /> Use Camera
      </button>
      {/* <CameraComponent/> */}
    </div>
  );
}

export default AddRecipeScreen;
