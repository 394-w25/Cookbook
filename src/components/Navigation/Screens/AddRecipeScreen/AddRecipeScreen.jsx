import React from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import './AddRecipeScreen.css'; 
import { useNavigate } from 'react-router-dom';

function AddRecipeScreen() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="title">How do you want to input your recipe?</h1>

      <div className="button-group">
        <div className="button-container">
          <button className="button" onClick={() => navigate("/cameraComponent")}>
            Use a photo
          </button>
        </div>
      </div>

      <nav className="bottom-nav">
        <div className="nav-container">
          <button className="nav-button" onClick={() => navigate("/home")}>
            Home
          </button>
          <button className="nav-button" onClick={() => navigate("/recipeBox")}>
            Recipe Box
          </button>
          <button className="nav-button" onClick={() => navigate("/addRecipe")}>
            Add Recipe
          </button>
          <button className="nav-button" onClick={() => navigate("/myFamily")}>
            My Family
          </button>
        </div>
      </nav>
    </div>
  );
}

export default AddRecipeScreen;