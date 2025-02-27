// import React from 'react';
// import './RecipePage.css';

// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardActionArea from '@mui/material/CardActionArea';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import CardHeader from '@mui/material/CardHeader';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import { useParams } from 'react-router-dom';

// // firebase
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../../utilities/firebase";

// // function for parsing openai prompting
// import parseMarkdown from "../../../utilities/parseRecipeIntoComponents";

// function RecipePage() {
//   async function getRecipeInfoFromDB( recipeId ) {
//     try {
//       const docSnap = await getDocs(collection(db, "Recipes"));
//       const recipes = [];
//       docSnap.forEach((doc) => {
//         if (doc.id === recipeId.id) {
//           console.log("1")
//           const data = doc.data();
//           recipes.push({
//             id: doc.id,
//             ...data,
//           });
//         }
//       });
      
//       console.log("recipe data: ", recipes);
//       return recipes[0];
//     } catch (error) {
//       console.error("Error fetching recipe info: ", error);
//     }
//   }
  
//   // this is in the url
//     const recipeId = useParams();
//     const [recipes, setRecipes] = React.useState([]);

//     // console.log("firebase recipe id: ", recipeId)
//     // console.log("parsed recipe: ", parseMarkdown(recipes.Recipe))

//     React.useEffect(() => {
//       async function fetchRecipe() {
//         const fetched = await getRecipeInfoFromDB(recipeId);
//         setRecipes(fetched);
//       };
//       fetchRecipe();
//     }, []);

//     console.log("recipe title: ", recipes.Title);

//     // console.log("parsed recipe: ", parseMarkdown(recipes.Recipe))
    
//     return (
//       <Card className="recipe-cookbook-card">
//           {/* <Typography
//             className="recipe-cookbook-card-creator"
//           >
//             Chef:
//           </Typography> */}
        
//           <CardHeader
//           title={recipes.Title}
//           subheader="Serves x people"
//           className = "recipe-cookbook-card-header"
//           />
          
//         <CardMedia
//           component="img"
//           height="100"
//           image={recipes.Image}
//           alt="recipe image"
//           className="recipe-cookbook-card-media"
//         />
        
//         <Typography>
//             {recipes?.Recipe
//               ? Object.entries(parseMarkdown(recipes.Recipe)).map(([section, content]) => (
//                   <div key={section}>
//                     <h3>{section.toUpperCase()}</h3>
//                     <p>{content}</p>
//                   </div>
//                 ))
//               : "Loading recipe..."}
//           </Typography>

//         <CardContent className="recipe-cookbook-card-content">
//           <Typography 
//             gutterBottom 
//             variant="h7" 
//             component="div"
//           >
//               This is a test description {recipes.JournalEntry}
//           </Typography>

//           <br></br>
//           <br></br>

//           <Typography 
//             variant="body2" 
//             className="recipe-cookbook-card-date"
//           >
//             {/* Date: {formattedDate} */}
//           </Typography>
//         </CardContent>
//         <CardContent>
//           <Grid>
//             <Grid></Grid>
//             <Grid></Grid>
//           </Grid>
//         </CardContent>
//       </Card>
//     )
// }

// export default RecipePage;


import React from 'react';
import './CookbookPage.css';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';

// Firebase
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../utilities/firebase";

// Function for parsing OpenAI prompting
import parseMarkdown from "../../../utilities/parseRecipeIntoComponents";

function CookbookPage() {
  async function getRecipeInfoFromDB(recipeId) {
    try {
      const docSnap = await getDocs(collection(db, "Recipes"));
      const recipes = [];
      docSnap.forEach((doc) => {
        if (doc.id === recipeId.id) {
          const data = doc.data();
          recipes.push({
            id: doc.id,
            ...data,
          });
        }
      });

      return recipes[0];
    } catch (error) {
      console.error("Error fetching recipe info: ", error);
    }
  }

  const recipeId = useParams();
  const [recipe, setRecipe] = React.useState(null);

  React.useEffect(() => {
    async function fetchRecipe() {
      const fetched = await getRecipeInfoFromDB(recipeId);
      setRecipe(fetched);
    };
    fetchRecipe();
  }, []);

  if (!recipe) {
    return <Typography className="loading-text">Loading recipe...</Typography>;
  }

  const parsedRecipe = recipe.Recipe ? parseMarkdown(recipe.Recipe) : {};

  console.log("Parsed recipe: ", parsedRecipe["ingredients"]);

  return (
    <Card className="recipe-cookbook-container">
      <div className="recipe-header">
        <Typography variant="h3" className="recipe-title">
          {recipe.Title}
        </Typography>
        <Typography variant="body2" className="recipe-meta">
          Serves {recipe.Servings} | Active Time: {recipe.ActiveTime} mins | Total Time: {recipe.TotalTime} mins
        </Typography>
        <hr></hr>
        <Typography variant="body1" className="recipe-description">
          {recipe.JournalEntry}
        </Typography>
      </div>

      <CardMedia
        component="img"
        image={recipe.Image}
        alt="Recipe Image"
        className="recipe-image"
      />

      <Grid container spacing={3} className="recipe-content">
        {/* Ingredients */}
        <Grid item xs={12} md={5} className="recipe-ingredients">
          <Typography variant="h5" className="section-title">Ingredients</Typography>
          {/* <ul> */}
            {parsedRecipe["ingredients"]?.split("\n").map((item, index) => (
              <h5 key={index}>{item}</h5>
            ))}
          {/* </ul> */}
        </Grid>

        {/* Instructions */}
        <Grid item xs={12} md={7} className="recipe-instructions">
          <Typography variant="h5" className="section-title">Instructions</Typography>
          {/* <ul> */}
            {parsedRecipe["instructions"]?.split("\n").map((step, index) => (
              <h5 key={index}>{step}</h5>
            ))}
          {/* </ul> */}
        </Grid>
      </Grid>
    </Card>
  );
}

export default CookbookPage;
