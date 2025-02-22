import React from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import './AddRecipeScreen.css'; 
import { useNavigate } from 'react-router-dom';

function AddRecipeScreen() {
  const navigate = useNavigate();

  return (
    <div className="recipescreen-container">
      <h1>How do you want to input your recipe?</h1>
      <button className="button" onClick={() => navigate("/cameraComponent")}>
        Use a photo {<CameraAltIcon></CameraAltIcon>}
      </button>
    </div>
  );
}

export default AddRecipeScreen;