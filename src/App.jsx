import './App.css';
import HomeScreen from './components/HomeScreen/HomeScreen';
import CameraComponent from './components/CameraComponent/camera_component';

const App = () => {
  return (
    <div className="App">
      <HomeScreen />
      <CameraComponent />
    </div>
  );
};

export default App;
