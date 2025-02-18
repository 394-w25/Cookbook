import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CardHeader from '@mui/material/CardHeader';
import "./Recipe.css";

function Recipe({
    title,
    imageURL,
    description,
    ingredients,
    steps
}) {
  return (
    <Card sx={{ maxWidth: 345 }} className="recipe-card">
      <CardActionArea>
      <CardHeader
          title={title}
          subheader={description}
          sx={{ textAlign: 'center' }}
        />
        <CardMedia
          component="img"
          height="500"
          image={imageURL}
          alt="recipe image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {ingredients}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {steps}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default Recipe;