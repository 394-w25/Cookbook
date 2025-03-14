import React, {useState} from 'react';
import "./NavigationBar.css";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Diversity1 from '@mui/icons-material/Diversity1';
import { useNavigate, useLocation } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

function NavigationBar() {
  const navigate = useNavigate();
  const [value, setValue] = useState("recipe box");

  const handleChange = (_, newValue) => {
    if (newValue !== "my family") {
      setValue(newValue);
    }
  };

  return (
    <BottomNavigation className="bottom-nav" value={value} showLabels onChange={handleChange}>
        <BottomNavigationAction label="my family" value="my family" icon={<Diversity1 />}
        sx={{
          pointerEvents: 'none',
        }}
        />
        <BottomNavigationAction label="add recipe" value="add recipe" icon={<AddCircleOutlineIcon />} onClick={() => navigate("/AddRecipe")} />
        <BottomNavigationAction label="recipe box" value="recipe box" icon={<RestaurantIcon />} onClick={() => navigate("/home")}/>
    </BottomNavigation>
  );
};

export default NavigationBar;