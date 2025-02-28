import React, { useEffect, useState } from 'react';
import RecipeComponent from '@/components/Recipe/RecipeComponent';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/utilities/firebase';
import { Box } from '@mui/material';
import "./HomeScreen.css";

function HomeScreen() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, "Recipes"));
      const recipesData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dateValue = data.Date instanceof Timestamp ? data.Date.toDate() : null;

        recipesData.push({
          recipeId: doc.id,
          title: data.Title || "Untitled Recipe",
          category: data.Category || "No Category",
          author: data.Author || "Unknown",
          date: dateValue,
          cookbook: data.cookbook || "No Cookbook",
          image: data.Image || "",
          prepTime: data.PrepTime || "",
          cookTime: data.CookTime || "",
          servingSize: data.ServingSize || ""
        });
      });

      const sortedRecipes = recipesData.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date - a.date;
      });

      setRecipes(sortedRecipes);
    };

    fetchRecipes();
  }, []);

  return (
    <div className = "home-container">
    <Box className="recipes-list">
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <RecipeComponent
            key={recipe.recipeId}
            recipeId={recipe.recipeId}
            title={recipe.title}
            category={recipe.category}
            author={recipe.author}
            date={recipe.date}
            cookbook={recipe.cookbook}
            image={recipe.image}
            prepTime={recipe.prepTime}
            cookTime={recipe.cookTime}
            servingSize={recipe.servingSize}
          />
        ))
      ) : (
        <p>Loading recipes...</p>
      )}
    </Box>
    </div>
  );
}

export default HomeScreen;
