import React from 'react';
import "./NavigationBar.css";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Diversity1 from '@mui/icons-material/Diversity1';
import { useNavigate } from 'react-router-dom';

function NavigationBar() {

  const navigate = useNavigate();
  return (
    <BottomNavigation className="bottom-nav" showLabels>
        <BottomNavigationAction label="home" icon={<HomeIcon />} onClick={() => navigate("/home")}/>
        <BottomNavigationAction label="recipe box" icon={<RestaurantIcon />} />
        <BottomNavigationAction label="add recipe" icon={<AddCircleOutlineIcon />} onClick={() => navigate("/AddRecipe")} />
        <BottomNavigationAction label="cookbooks" icon={<MenuBookIcon />} />
        <BottomNavigationAction label="my family" icon={<Diversity1 />} />
    </BottomNavigation>
  );
};

export default NavigationBar;