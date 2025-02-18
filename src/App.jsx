import './App.css';
import HomeScreen from './components/HomeScreen/HomeScreen';
import CameraComponent from './components/CameraComponent/cameraComponent';
import SignIn from './components/SignIn/SignIn';
import Recipe from './components/Recipe/Recipe';

const App = () => {
  return (
    <div className="App">
      <SignIn />
      <HomeScreen />
      <CameraComponent />
      <Recipe 
      title="Samosa's"
      imageURL="https://picsum.photos/200"
      description="Great Indian appetizer"
      ingredients="white potatoes, salt to taste, red pepper"
      steps="1. Boil potatoes until soft. 2. Combine rest of ingredients to..."
      />
    </div>
  );
};

export default App;
