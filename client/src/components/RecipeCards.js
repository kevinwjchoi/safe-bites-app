import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

const RecipeCards = ({ recipes }) => {
  return (
    <div>
      {recipes.map(recipe => (
        <Card key={recipe.id} style={{ margin: '10px', maxWidth: 345 }}>
          <CardMedia
            component="img"
            height="140"
            image={recipe.image}
            alt={recipe.title}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {recipe.title}
            </Typography>
            <Button
              component={Link}
              to={`/recipe/${recipe.id}`}
              variant="contained"
              color="primary"
              style={{ marginTop: '10px' }}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecipeCards;
