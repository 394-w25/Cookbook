import React from 'react';
import { Link } from 'react-router-dom'; 
import NavigationBar from '../NavigationBar/NavigationBar';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import './AddRecipe.css'; 

function AddRecipe() {
  return (
    <div className="container">
      <Link to="/cameraComponent">
        <button className="button">
          <CameraAltIcon /> Use Camera
        </button>
      </Link>
      <NavigationBar />
    </div>
  );
}

export default AddRecipe;
