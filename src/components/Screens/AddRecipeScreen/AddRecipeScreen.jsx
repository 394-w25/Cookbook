import React from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import './AddRecipeScreen.css'; 
import { useNavigate } from 'react-router-dom';

function AddRecipeScreen() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="title">How do you want to input your recipe?</h1>
      <button className="button" onClick={() => navigate("/cameraComponent")}>
        Use a photo
      </button>
    </div>
  );
}

export default AddRecipeScreen;