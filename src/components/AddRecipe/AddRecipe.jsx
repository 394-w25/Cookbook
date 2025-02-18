import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavigationBar from '../NavigationBar/NavigationBar';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import './AddRecipe.css'; 

function AddRecipe() {

  const navigate = useNavigate();
  return (
    <div className="container">
      <button 
        className="button"
        onClick={() => navigate("/cameraComponent")} // Navigate to /cameraComponent
      >
        <CameraAltIcon /> Use Camera
      </button>
      <NavigationBar />
    </div>
  );
}

export default AddRecipe;
