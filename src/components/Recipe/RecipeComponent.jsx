import * as React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, CardHeader } from '@mui/material';
import './RecipeComponent.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

function RecipeComponent({
    title,
    category,
    creator,
    date,
    recipeText,
    cookbook
}) {
  console.log("Rendering recipe:", { title, category, creator, date, recipeText, cookbook });

  const formattedDate = date.toString()

  return (
    <Card className="recipe-card">
      <CardActionArea>
        <CardHeader
          title={title}
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
          height="300"
          image={"default-image.jpg"}
          alt="recipe image"
          className="recipe-card-media"
        />
        <CardContent className="recipe-card-content">
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
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
          <Typography 
            variant="body2" 
            className="recipe-card-text"
          >
            {recipeText}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default RecipeComponent;
