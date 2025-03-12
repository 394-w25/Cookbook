import React from 'react';
import { AppBar, Typography, IconButton, Toolbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import "./TopBar.css";

function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const showBackButton = location.pathname === "/EditRecipeChatbot";

  const handleBack = () => {
    navigate("/EditRecipe", { state: location.state }); // Pass updated recipe data
  };

  const formatRouteName = (pathname) => {
    if (pathname === "/") return "recipe box";
    if (pathname === "/home") return "recipe box";
    if (pathname.includes("recipe")) return "recipe";
    return pathname.replace("/", "").replace(/([A-Z])/g, ' $1').trim().toLowerCase();
  };

  return (
    <AppBar position="static" className="top-bar">
      <Toolbar className="top-bar-toolbar">
        {showBackButton && (
          <IconButton className="back-button" onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h6" className="top-bar-title">
          {formatRouteName(location.pathname)}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
