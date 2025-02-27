import React, { useEffect, useState } from 'react';
import RecipeComponent from '@/components/Recipe/RecipeComponent';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utilities/firebase';
import { Timestamp } from 'firebase/firestore';  // Import Timestamp to handle it explicitly
import { Box } from '@mui/material';
import "./HomeScreen.css";

function HomeScreen() {
  const [recipes, setRecipes] = useState([]);  // State to store the fetched recipes

  // Fetch recipes from Firestore when the component mounts
  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, "Recipes"));
      const recipesData = [];

      // Loop through the querySnapshot and push each recipe into the array
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        console.log('Raw Date Field:', data.Date);  // Log the raw Date field to inspect it

        // Handle Firestore Timestamp if Date is a Firestore Timestamp
        const formattedDate = 
          data.Date instanceof Timestamp ? 
          data.Date.toDate().toString() : 
          data.Date || "No valid date";  // Handle cases where Date is not a Timestamp
        
        const imageUrl = data.Image || "default-image-url";  // Fallback image URL (e.g., a placeholder image)
        
        recipesData.push({
          recipeId: doc.id,
          title: data.Title,
          category: data.Category,
          creator: data.Creator,
          date: formattedDate,  // Use the formatted date
          recipeText: data.Recipe,
          cookbook: data.cookbook,
          image: imageUrl
        });
      });

      // Update the state with the fetched recipes
      setRecipes(recipesData);
    };

    fetchRecipes();
  }, []);  // Empty dependency array ensures this runs only once when the component mounts

  return (
    <Box className="recipes-list">
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <RecipeComponent
            key={recipe.recipeId}
            recipeId = {recipe.recipeId}  //Pass the ID from the recipe data
            title={recipe.title}         // Pass the Title from the recipe data
            category={recipe.category}   // Pass the Category from the recipe data
            creator={recipe.creator}     // Pass the Creator from the recipe data
            date={recipe.date}           // Pass the formatted Date
            recipeText={recipe.recipeText}   // Pass the Recipe text/steps
            cookbook={recipe.cookbook}   // Pass the cookbook text
            image = {recipe.image}
          />
        ))
      ) : (
        <p>Loading recipes...</p>  // Display a loading message while fetching data
      )}
    </Box>
  );
}

export default HomeScreen;
