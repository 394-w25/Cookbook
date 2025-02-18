import React from 'react';
import { Link } from 'react-router-dom'; 
import NavigationBar from '../NavigationBar/NavigationBar';
import './AddRecipe.css'; 

function AddRecipe() {
  return (
    <div className="container">
      <Link to="/cameraComponent"> 
        <button className="button">Use Camera</button>
      </Link>
      <NavigationBar />
    </div>
    
  );
}

export default AddRecipe;
