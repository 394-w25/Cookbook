import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import './RecipeComponent.css';

function RecipeComponent({
  recipeId,
  title,
  author,
  image,
  prepTime,
  servingSize,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <Card className="recipe-card">
      <CardActionArea onClick={handleClick}>
        {image && (
          <CardMedia
            component="img"
            image={image}
            alt="recipe image"
            className="recipe-card-media"
          />
        )}
        <CardContent className="recipe-card-content">
          <Typography variant="h6" component="div" className="recipe-card-title">
            {title}
          </Typography>
          <Typography variant="body2" className="recipe-author">
            Creator: <span className="author-name">{author}</span>
          </Typography>
          <Stack direction="row" spacing={1} className="recipe-stats">
            {servingSize && <Chip sx={{ border: 2 }} label={`Serves ${servingSize}`} className="recipe-chip" />}
            {prepTime && <Chip sx={{ border: 2 }} label={`${prepTime} min`} className="recipe-chip" />}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default RecipeComponent;