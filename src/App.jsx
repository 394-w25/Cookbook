import './App.css';
import HomeScreen from '@/components/Navigation/Screens/HomeScreen/HomeScreen';
import SignInScreen from '@/components/Navigation/Screens/SignInScreen/SignInScreen';
import AddRecipeScreen from '@/components/Navigation/Screens/AddRecipeScreen/AddRecipeScreen';
import CameraComponent from '@/components/Photo/CameraComponent/CameraComponent'
import PromptsScreen from './components/PromptsScreen/PromptsScreen';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import MainLayout from '@/components/Navigation/MainLayout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInScreen />} />

        {/* wrap all other routes with MainLayout to have top bar and navbar */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/AddRecipe" element={<AddRecipeScreen />} />
          <Route path="/CameraComponent" element={<CameraComponent />} />
          <Route path="/prompts" element={<PromptsScreen />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
