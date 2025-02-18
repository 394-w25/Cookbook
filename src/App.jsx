import './App.css';
import HomeScreen from './components/HomeScreen/HomeScreen';
import CameraComponent from './components/CameraComponent/cameraComponent';
import SignIn from './components/SignIn/SignIn';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Recipe from './components/Recipe/Recipe';
import AddRecipe from './components/AddRecipe/AddRecipe';
import RecipeCamera from './components/cameraComponent/cameraComponent';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/AddRecipe" element={<AddRecipe />} />
        <Route path="/cameraComponent" element={<RecipeCamera />} />
      </Routes>
    </Router>
  );
};

export default App;
