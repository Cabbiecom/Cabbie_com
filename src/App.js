import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
//import logo from "./Assets/images/Cabbie.png";
import "./App.css";
import HomeScreen from "./Screens/Cliente/Home/HomeScreen";
//import Navbar from "./Components/Navbar/Navbar";
//import Journey from "./Screens/Cliente/Journey/Journey";
import Profile from "./Screens/Cliente/Profile/Profile";
import ConversationMessage from "./Components/Chat/ConversationMessage.jsx/ConversationMessage";
import CallMessageConversationMessage from "./Components/Call/CallMessageConversationMessage";
import ChatMessage from "./Components/Chat/ChatMessage/ChatMessage";
import EditProfile from "./Components/EditProfile/EditProfile";
import SignIn from "./Config/SignIn/SignIn";
import SignUp from "./Config/SingUp/SignUp";
import HomeTaxista from "./Screens/taxista/HomeTaxista";
import TaxiChatComponent from "./Screens/taxista/Chat/ChatTaxista/TaxiChatComponent";
import ChatList from "./Screens/taxista/Chat/ChatList/ChatList";
import ChatConversationClient from "./Screens/taxista/Chat/ChatConversation/ChatConversationClient";
import HomeAdmin from "./Screens/Admin/Home/HomeAdmin";
import Legal from "./Screens/Page/Legal";
import Dashboard from "./Screens/Admin/Dashboard/Dashboard";
import { getAuth } from "firebase/auth";
import { Navigate, Outlet } from "react-router-dom";

const AuthCheck = () => {
  //constante para validar el inicio activo
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setIsChecking(false);
    });
  }, []);

  if (isChecking) {
    // Opcional: Renderiza algún componente de carga mientras se verifica la autenticación
    return <div>Verificando autenticación...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Legal" element={<Legal />} />

        <Route element={<AuthCheck />}>
          <Route path="/HomeAdmin" element={<HomeAdmin />} />
          <Route path="/HomeScreen" element={<HomeScreen />} />
          <Route path="/HomeTaxista" element={<HomeTaxista />} />

          <Route path="/Profile" element={<Profile />} />
          <Route
            path="/ConversationMessage"
            element={<ConversationMessage />}
          />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route
            path="/CallMessageConversationMessage"
            element={<CallMessageConversationMessage />}
          />

          <Route path="/ChatList" element={<ChatList />} />
          <Route path="/ChatMessage" element={<ChatMessage />} />
          <Route path="/chat/:UsuarioId" element={<ChatConversationClient />} />
          <Route path="/chat/:chatId" element={<TaxiChatComponent />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
