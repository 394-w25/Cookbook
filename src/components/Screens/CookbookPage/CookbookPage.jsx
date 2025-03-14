import React from 'react';
import './CookbookPage.css';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../utilities/firebase";
import ReactMarkdown from 'react-markdown';



function CookbookPage() {
  async function getRecipeInfoFromDB(recipeId) {
    try {
      const snapshot = await getDocs(collection(db, "Recipes"));
      const matching = [];
      snapshot.forEach((doc) => {
        if (doc.id === recipeId.id) {
          matching.push({ id: doc.id, ...doc.data() });
        }
      });
      return matching[0];
    } catch (error) {
      console.error("Error fetching recipe info: ", error);
    }
  }

  const recipeId = useParams();
  const [recipe, setRecipe] = React.useState(null);

  React.useEffect(() => {
    async function fetchRecipe() {
      const fetched = await getRecipeInfoFromDB(recipeId);
      setRecipe(fetched || null);
    }
    fetchRecipe();
  }, [recipeId]);

  if (!recipe) {
    return <Typography className="loading-text">Loading recipe...</Typography>;
  }

  return (
    <Card className="recipe-cookbook-container"
    sx={{
      boxShadow: "none",
    }}
    >

      {recipe.Image && (
        <CardMedia
          component="img"
          image={recipe.Image}
          alt="Recipe Image"
          className="recipe-image"
        />
      )}
      
      <div className="recipe-header">
        <Typography variant="h3" className="recipe-title">
          {recipe.Title || "Untitled Recipe"}
        </Typography>
        {(recipe.Author || recipe.ServingSize || recipe.PrepTime || recipe.CookTime) && (
          <Typography variant="body2" className="recipe-meta">
            {recipe.Author && `Author: ${recipe.Author}  |  `}
            {recipe.ServingSize && `Serves: ${recipe.ServingSize}  |  `}
            {recipe.PrepTime && `Prep Time: ${recipe.PrepTime}  |  `}
            {recipe.CookTime && `Cook Time: ${recipe.CookTime}`}
          </Typography>
        )}
        <hr />
        <Typography variant="h5" className="section-title"
        sx={{
          textAlign: 'left',
          marginTop: '30px',
          marginBottom: '10px'
        }}
        >
            Story
          </Typography>
        {recipe.Story && (
          <Typography variant="body1" className="recipe-description">
            {recipe.Story}
          </Typography>
        )}
        {!recipe.Story && recipe.JournalEntry && (
          <Typography variant="body1" className="recipe-description">
            {recipe.JournalEntry}
          </Typography>
        )}
      </div>

          <Typography variant="h5" className="section-title">
            Ingredients
          </Typography>
          {recipe.Ingredients
            ? 
                <ReactMarkdown>
                  {recipe.Ingredients}
                </ReactMarkdown>
            : <Typography variant="body1">No ingredients provided.</Typography>
          }

          <br/>

          <Typography variant="h5" className="section-title">
            Instructions
          </Typography>
          {recipe.Steps ? 
            <ReactMarkdown>
            {recipe.Steps}
            </ReactMarkdown>
            : <Typography variant="body1">No steps provided.</Typography>
          }

      {Array.isArray(recipe.CustomSections) && recipe.CustomSections.length > 0 && (
        <div className="extra-sections">
          {recipe.CustomSections.map((section, idx) => (
            <div key={idx} className="extra-section-block">
              <Typography variant="h5" className="section-title">
                {section.header}
              </Typography>
              <Typography variant="body1" className="section-content">
                {section.content}
              </Typography>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default CookbookPage;
