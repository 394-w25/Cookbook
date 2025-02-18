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



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<HomeScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
