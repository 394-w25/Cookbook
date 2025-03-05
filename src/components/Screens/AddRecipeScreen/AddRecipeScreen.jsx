import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AddRecipeScreen.css';
import scanImage from '@/assets/images/scanpic.png';
import recImage from '@/assets/images/recpic.png';


function AddRecipeScreen() {
  const navigate = useNavigate();

  return (
    <div className="recipescreen-container">
      <div className="card" onClick={() => navigate("/CameraComponent")}>
        <div className="card-left">
          <img src={scanImage} alt="Scan Image" className="card-image" />
        </div>
        <div className="card-right">
          <span className="card-text">Scan, Upload Photo</span>
        </div>
      </div>
      <div className="card" onClick={() => navigate("/VoiceRecordRecipe")}>
        <div className="card-left">
          <img src={recImage} alt="Rec Image" className="card-image" />
        </div>
        <div className="card-right">
          <span className="card-text">Voice record recipe</span>
        </div>
      </div>
    </div>
  );
}

export default AddRecipeScreen;
