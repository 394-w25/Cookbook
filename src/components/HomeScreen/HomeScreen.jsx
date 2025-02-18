import React from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';
import RecipeCamera from '../CameraComponent/cameraComponent';


function HomeScreen() {
  return (
    <div>
      <RecipeCamera />
      <NavigationBar />
    </div>
  );
};

export default HomeScreen;