import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Chip
} from '@mui/material';
import './RecipeComponent.css';

function RecipeComponent({
  recipeId,
  title,
  category,
  author,
  date,
  cookbook,
  image,
  prepTime,
  cookTime,
  servingSize
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe/${recipeId}`);
  };

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date";

  return (
    <Card className="recipe-card">
      <CardActionArea onClick={handleClick}>
        {image && (
          <CardMedia
            component="img"
            height="250"
            image={image}
            alt="recipe image"
            className="recipe-card-media"
          />
        )}
        <CardContent className="recipe-card-content">
          <Typography variant="h5" component="div" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" className="recipe-card-author">
            {author ? `Author: ${author}` : ""}
          </Typography>
          <Typography variant="body2" className="recipe-card-date">
            {formattedDate}
          </Typography>
          <Stack direction="row" spacing={1} className="recipe-stats">
            {servingSize && <Chip label={`Serves: ${servingSize}`} />}
            {prepTime && <Chip label={`Prep: ${prepTime}`} />}
            {cookTime && <Chip label={`Cook: ${cookTime}`} />}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default RecipeComponent;
