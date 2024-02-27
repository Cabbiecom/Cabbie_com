import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import logo from "./Assets/images/Cabbie.png";
import "./App.css";
import HomeScreen from "./Screens/Home/HomeScreen";
import Navbar from "./Components/Navbar/Navbar";
import Journey from "./Screens/Journey/Journey";
import Profile from "./Screens/Profile/Profile";
import ConversationMessage from "./Components/Chat/ConversationMessage.jsx/ConversationMessage";
import CallMessageConversationMessage from "./Components/Call/CallMessageConversationMessage";
import ChatMessage from "./Components/Chat/ChatMessage/ChatMessage";
import EditProfile from "./Components/EditProfile/EditProfile";
import SignIn from "./Config/SignIn/SignIn";
import SignUp from "./Config/SingUp/SignUp";
 

// Componente SplashScreen
const SplashScreen = () => (
  <div className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <p>Cargando...</p>
  </div>
);

// Componente App con SplashScreen y rutas
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // Muestra el SplashScreen durante 3 segundos
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomeScreen />} />
        <Route path="/Journey" element={<Journey />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/ConversationMessage" element={<ConversationMessage />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route
          path="/CallMessageConversationMessage"
          element={<CallMessageConversationMessage />}
        />
        <Route path="/ChatMessage" element={<ChatMessage />} />
      </Routes>
    </Router>
  );
}

export default App;
