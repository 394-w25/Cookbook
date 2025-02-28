import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AddRecipeScreen.css';
import scanImage from '@/assets/images/scanpic.png'; // Using your uploaded image

function AddRecipeScreen() {
  const navigate = useNavigate();

  return (
    <div className="recipescreen-container">
      <div className="card" onClick={() => navigate("/CameraComponent")}>
        <div className="card-left">
          <img src={scanImage} alt="Scan Image" className="card-image" />
        </div>
        <div className="card-right">
          <span className="card-text">Scan, Upload Photo/Video</span>
        </div>
      </div>
    </div>
  );
}

export default AddRecipeScreen;
