import React, {SyntheticEvent} from 'react';
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
  const [value, setValue] = React.useState("home");

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation className="bottom-nav" value={value} showLabels onChange={handleChange}>
        <BottomNavigationAction label="home" value="home" icon={<HomeIcon />} onClick={() => navigate("/home")}/>
        <BottomNavigationAction label="recipe box" value="recipe box" icon={<RestaurantIcon />} />
        <BottomNavigationAction label="add recipe" value="add recipe" icon={<AddCircleOutlineIcon />} onClick={() => navigate("/AddRecipe")} />
        <BottomNavigationAction label="cookbooks" value="cookbooks" icon={<MenuBookIcon />} />
        <BottomNavigationAction label="my family" value="my family" icon={<Diversity1 />} />
    </BottomNavigation>
  );
};

export default NavigationBar;