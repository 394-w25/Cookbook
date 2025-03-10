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
import { auth } from "./utilities/firebase.js";
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout/MainLayout';
import React, { useState, useEffect } from 'react';

const RequireAuth = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (curUser) => {
      setUser(curUser);
      setAuthLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  if (!authLoaded) {
    return <div>Loading...</div>;
  }

  // App.jsx (wrap entire Routes inside the frame)
  return (
    <div className="mobile-frame">
      <Router>
        <Routes>
          <Route path="/" element={<SignInScreen setUser={setUser} />} />

          <Route element={<RequireAuth user={user}><MainLayout /></RequireAuth>}>
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
    </div>
  );
};

export default App;
