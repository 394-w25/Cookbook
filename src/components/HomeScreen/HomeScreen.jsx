import React, { useEffect, useState } from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';
import RecipeCamera from '../CameraComponent/cameraComponent';
import Recipe from '../Recipe/Recipe';  // Import the Recipe component
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../utilities/firebase';

function HomeScreen() {
  const [recipes, setRecipes] = useState([]);  // State to store the fetched recipes

  // Fetch recipes from Firestore when the component mounts
  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, "Recipes"));
      const recipesData = [];
      
      // Loop through the querySnapshot and push each recipe into the array
      querySnapshot.forEach((doc) => {
        recipesData.push({ id: doc.id, ...doc.data() });
      });
      
      // Update the state with the fetched recipes
      setRecipes(recipesData);
    };

    fetchRecipes();
  }, []);  // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div>
<<<<<<< HEAD
      {/* <RecipeCamera /> */}
      <Recipe 
        title="Samosa's"
        imageURL="https://picsum.photos/200"
        description="Great Indian appetizer"
        ingredients="white potatoes, salt to taste, red pepper"
        steps="1. Boil potatoes until soft. 2. Combine rest of ingredients to..."
      />
=======
      <RecipeCamera />
      
      {/* Render each recipe dynamically */}
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <Recipe
            key={recipe.id}
            title={recipe.Title}         // Pass the Title from the recipe data
            category={recipe.Category}   // Pass the Category from the recipe data
            creator={recipe.Creator}     // Pass the Creator from the recipe data
            date={recipe.Date}           // Pass the Date (Firestore Timestamp) from the recipe data
            recipeText={recipe.Recipe}   // Pass the Recipe text/steps (adjust as needed)
          />
        ))
      ) : (
        <p>Loading recipes...</p>  // Display a loading message while fetching data
      )}
      
>>>>>>> 3e80c8e (linking recipe card to database)
      <NavigationBar />
    </div>
  );
}

export default HomeScreen;
