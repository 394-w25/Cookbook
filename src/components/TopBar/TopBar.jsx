import React from 'react';
import { AppBar, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import "./TopBar.css";

function TopBar() {
  const location = useLocation(); // Get current route

  // Define routes that should display "Add Recipe"
  const addRecipeRoutes = ["/AddRecipe", "/CameraComponent", "/prompts"];

  // Format the route name properly
  const formatRouteName = (pathname) => {
    if (pathname === "/") return "Home"; 
    if (addRecipeRoutes.includes(pathname)) return "Add Recipe"; // Force these to be "Add Recipe"
    if (pathname.includes("recipe")) return "Recipe";

    // Default formatting for other routes
    const formattedName = pathname.replace("/", "").replace(/([A-Z])/g, ' $1').trim();
    return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
  };

  return (
    <AppBar className="top-bar">
        {formatRouteName(location.pathname)}
    </AppBar>
  );
}

export default TopBar;
