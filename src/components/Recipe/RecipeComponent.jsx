import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, CardActionArea, CardHeader } from '@mui/material';
import './RecipeComponent.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

function RecipeComponent({
    recipeId,
    title,
    category,
    creator,
    date,
    recipeText,
    cookbook,
    image
}) {
  console.log("Rendering recipe:", { recipeId, title, category, creator, date, recipeText, cookbook, image });

  const formattedDate = date.toString()

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <div>
      <Card className="recipe-card">
        <CardActionArea onClick={handleClick}>
          <CardHeader
            subheader={
            <Stack direction="row" spacing={1}>
              <Chip label={category} />
              <Chip label={cookbook} />
            </Stack>
            }
            className="recipe-card-header"
          />
          <CardMedia
            component="img"
            height="200"
            image={image}
            alt="recipe image"
            className="recipe-card-media"
          />
          <CardContent className="recipe-card-content">
            <Typography 
              gutterBottom 
              variant="h7" 
              component="div"
            >
              {title}
            </Typography>
            <Typography
              className="recipe-card-creator"
            >
              Chef: {creator}
            </Typography>
            <Typography 
              variant="body2" 
              className="recipe-card-date"
            >
              Date: {formattedDate}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}

export default RecipeComponent;
