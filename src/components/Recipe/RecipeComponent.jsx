import * as React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, CardHeader } from '@mui/material';

function RecipeComponent({
    title,
    category,
    creator,
    date,
    recipeText
}) {
  console.log("Rendering recipe:", { title, category, creator, date, recipeText });

  const formattedDate = date ? new Date(date.seconds * 1000).toLocaleDateString() : "No date available";

  return (
    <Card sx={{ maxWidth: 345 }} className="recipe-card">
      <CardActionArea>
        <CardHeader
          title={title}
          subheader={category}
          sx={{ textAlign: 'center' }}
        />
        <CardMedia
          component="img"
          height="500"
          image={"default-image.jpg"}
          alt="recipe image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Created by: {creator}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Date: {formattedDate}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {recipeText}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default RecipeComponent;