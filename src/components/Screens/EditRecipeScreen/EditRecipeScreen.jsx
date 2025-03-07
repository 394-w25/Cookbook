import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './EditRecipeScreen.css';
import MicIcon from '@mui/icons-material/Mic';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { db } from '../../../utilities/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import ChatbotInputForm from '../../ChatbotInputForm/ChatbotInputForm';

export default function EditRecipeScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  let { recipeText = "", journalEntry = "", image = "" } = location.state || {};
  const [img, setImg] = useState(image || "");
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [story, setStory] = useState(journalEntry || "");
  const [author, setAuthor] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [customSections, setCustomSections] = useState([]);
  const [sectionVisibility, setSectionVisibility] = useState({
    title: true,
    story: true,
    ingredients: true,
    steps: true,
  });
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const [activeField, setActiveField] = useState(null);
  

  useEffect(() => {
    console.log("new state!", location.state);
    if (location.state?.recipeText) {
      recipeText = location.state.recipeText;
    }
    if (location.state?.journalEntry) {
      setStory(location.state.journalEntry);
    }
    if (location.state?.image) {
      setImg(location.state.image);
    }
  }, [location.state]);
  

  useEffect(() => {
    const lines = recipeText.split("\n");
    let foundIngredients = [];
    let foundSteps = [];
    let foundTitle = "";
    let currentMode = null;
    for (let l of lines) {
      const lower = l.toLowerCase();
      if (l.startsWith("# ")) {
        foundTitle = l.replace("# ", "").trim();
        currentMode = null;
      } else if (lower.startsWith("## ingredients")) {
        currentMode = "INGREDIENTS";
      } else if (lower.startsWith("## instructions")) {
        currentMode = "STEPS";
      } else {
        if (currentMode === "INGREDIENTS") foundIngredients.push(l);
        if (currentMode === "STEPS") foundSteps.push(l);
      }
    }
    setTitle(foundTitle || "Untitled Recipe");
    setIngredients(foundIngredients.join("\n").trim());
    setSteps(foundSteps.join("\n").trim());
  }, [recipeText]);

  const handleToggleMic = (field) => {
    if (!browserSupportsSpeechRecognition) return;
    if (activeField === field) {
      SpeechRecognition.stopListening();
      if (field === "title") {
        setTitle((prev) => (prev ? prev + " " + transcript : transcript));
      } else if (field === "story") {
        setStory((prev) => (prev ? prev + " " + transcript : transcript));
      } else if (field === "ingredients") {
        setIngredients((prev) => (prev ? prev + "\n" + transcript : transcript));
      } else if (field === "steps") {
        setSteps((prev) => (prev ? prev + "\n" + transcript : transcript));
      } else {
        setCustomSections((prev) =>
          prev.map((section) =>
            section.id === field
              ? { ...section, content: section.content + " " + transcript }
              : section
          )
        );
      }
      resetTranscript();
      setActiveField(null);
    } else {
      if (activeField) {
        SpeechRecognition.stopListening();
        resetTranscript();
      }
      setActiveField(field);
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleAddSection = () => {
    const id = Date.now().toString();
    const newSection = {
      id,
      header: "New Section",
      content: "",
    };
    setCustomSections((prev) => [...prev, newSection]);
  };

  const handleDeleteSection = (sectionName) => {
    if (
      sectionName === "title" ||
      sectionName === "story" ||
      sectionName === "ingredients" ||
      sectionName === "steps"
    ) {
      setSectionVisibility((prev) => ({
        ...prev,
        [sectionName]: false,
      }));
    } else {
      setCustomSections((prev) => prev.filter((s) => s.id !== sectionName));
    }
  };

  const handleDone = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      const docData = {
        Title: title,
        Author: author,
        ServingSize: servingSize,
        PrepTime: prepTime,
        CookTime: cookTime,
        Story: story,
        Ingredients: ingredients,
        Steps: steps,
        CustomSections: customSections.map((s) => ({
          header: s.header,
          content: s.content
        })),
        Image: image,
        Category: "Dinner",
        cookbook: "Rose Family Cookbook",
        Date: serverTimestamp(),
        UserName: user.displayName || user.email || "Unknown"
      };
      const collectionRef = collection(db, "Recipes");
      await addDoc(collectionRef, docData);
      navigate("/home");
    } catch (err) {
      console.error("Error saving recipe:", err);
    }
  };

  return (
    <div className="final-recipe-container">
      {image && (
        <img
          src={img}
          alt="Uploaded"
          className="final-recipe-image"
        />
      )}
      {sectionVisibility.title && (
        <div className="section-block large-title-row">
          <div className="editable-row">
            <input
              className="large-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {browserSupportsSpeechRecognition && (
              <MicIcon
                className={`mic-icon ${activeField === "title" ? "mic-active" : ""}`}
                onClick={() => handleToggleMic("title")}
              />
            )}
            <button className="delete-button" onClick={() => handleDeleteSection("title")}>
              X
            </button>
          </div>
        </div>
      )}
      <div className="small-fields-wrapper">
        <div className="editable-row">
          <label className="inline-label">Author:</label>
          <input
            className="small-subtitle-input"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="editable-row">
          <label className="inline-label">Serving Size:</label>
          <input
            className="small-subtitle-input"
            value={servingSize}
            onChange={(e) => setServingSize(e.target.value)}
          />
        </div>
        <div className="editable-row">
          <label className="inline-label">Prep Time:</label>
          <input
            className="small-subtitle-input"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
          />
        </div>
        <div className="editable-row">
          <label className="inline-label">Cook Time:</label>
          <input
            className="small-subtitle-input"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
          />
        </div>
      </div>
      {sectionVisibility.story && (
        <div className="section-block">
          <div className="section-header">
            <h2>Story</h2>
            {browserSupportsSpeechRecognition && (
              <MicIcon
                className={`mic-icon ${activeField === "story" ? "mic-active" : ""}`}
                onClick={() => handleToggleMic("story")}
              />
            )}
            <button className="delete-button" onClick={() => handleDeleteSection("story")}>
              X
            </button>
          </div>
          <textarea
            className="section-textarea"
            rows={4}
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />
        </div>
      )}
      {sectionVisibility.ingredients && (
        <div className="section-block">
          <div className="section-header">
            <h2>Ingredients</h2>
            {browserSupportsSpeechRecognition && (
              <MicIcon
                className={`mic-icon ${activeField === "ingredients" ? "mic-active" : ""}`}
                onClick={() => handleToggleMic("ingredients")}
              />
            )}
            <button className="delete-button" onClick={() => handleDeleteSection("ingredients")}>
              X
            </button>
          </div>
          <textarea
            className="section-textarea"
            rows={4}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>
      )}
      {sectionVisibility.steps && (
        <div className="section-block">
          <div className="section-header">
            <h2>Steps</h2>
            {browserSupportsSpeechRecognition && (
              <MicIcon
                className={`mic-icon ${activeField === "steps" ? "mic-active" : ""}`}
                onClick={() => handleToggleMic("steps")}
              />
            )}
            <button className="delete-button" onClick={() => handleDeleteSection("steps")}>
              X
            </button>
          </div>
          <textarea
            className="section-textarea"
            rows={4}
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
          />
        </div>
      )}
      {customSections.map((section) => (
        <div key={section.id} className="section-block">
          <div className="section-header">
            <input
              className="custom-section-title"
              value={section.header}
              onChange={(e) => {
                const newName = e.target.value;
                setCustomSections((prev) =>
                  prev.map((s) =>
                    s.id === section.id ? { ...s, header: newName } : s
                  )
                );
              }}
            />
            {browserSupportsSpeechRecognition && (
              <MicIcon
                className={`mic-icon ${activeField === section.id ? "mic-active" : ""}`}
                onClick={() => handleToggleMic(section.id)}
              />
            )}
            <button className="delete-button" onClick={() => handleDeleteSection(section.id)}>
              X
            </button>
          </div>
          <textarea
            className="section-textarea"
            rows={4}
            value={section.content}
            onChange={(e) => {
              const newContent = e.target.value;
              setCustomSections((prev) =>
                prev.map((s) =>
                  s.id === section.id ? { ...s, content: newContent } : s
                )
              );
            }}
          />
        </div>
      ))}
      <button className="add-section-button" onClick={handleAddSection}>
        + Add New Section
      </button>
      <div className="done-button-wrapper">
        <button className="done-button" onClick={handleDone}>
          Done
        </button>
      </div>
      <ChatbotInputForm />
    </div>
  );
}
