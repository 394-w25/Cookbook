import React from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';
import RecipeCamera from '../CameraComponent/cameraComponent';
import Recipe from '../Recipe/Recipe';


function HomeScreen() {
  return (
    <div>
      {/* <RecipeCamera /> */}
      <Recipe 
        title="Samosa's"
        imageURL="https://picsum.photos/200"
        description="Great Indian appetizer"
        ingredients="white potatoes, salt to taste, red pepper"
        steps="1. Boil potatoes until soft. 2. Combine rest of ingredients to..."
      />
      <NavigationBar />
    </div>
  );
};

export default HomeScreen;