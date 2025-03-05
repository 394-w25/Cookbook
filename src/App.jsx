import './App.css';
import HomeScreen from "./components/Screens/HomeScreen/HomeScreen";
import SignInScreen from './components/Screens/SignInScreen/SignInScreen';
import AddRecipeScreen from './components/Screens/AddRecipeScreen/AddRecipeScreen';
import CameraComponent from './components/CameraComponent/CameraComponent';
import PromptsScreen from './components/Screens/PromptsScreen/PromptsScreen';
import CookbookPage from "./components/Screens/CookbookPage/CookbookPage";
import EditRecipeScreen from './components/Screens/EditRecipeScreen/EditRecipeScreen';
import VoiceRecordRecipeScreen from './components/Screens/VoiceRecordRecipeScreen/VoiceRecordRecipeScreen';
import ChatbotScreen from './components/Screens/ChatbotScreen/ChatbotScreen';



import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import MainLayout from '@/components/MainLayout/MainLayout';
import React from 'react';

const App = () => {
  const [user, setUser] = React.useState(null);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInScreen setUser = {setUser}/>} />

        {/* wrap all other routes with MainLayout to have top bar and navbar */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/AddRecipe" element={<AddRecipeScreen />} />
          <Route path="/CameraComponent" element={<CameraComponent />} />
          <Route path="/VoiceRecordRecipe" element={<VoiceRecordRecipeScreen />} />
          <Route path="/prompts" element={<PromptsScreen />} />
          <Route path="/recipe/:id" element={<CookbookPage />} />
          <Route path="/EditRecipe" element={<EditRecipeScreen />} />
          <Route path="/EditRecipeChatbot" element={<ChatbotScreen />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
