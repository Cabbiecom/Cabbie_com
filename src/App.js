import React, { useContext } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
//import logo from "./Assets/images/Cabbie.png";
import "./App.css";
import HomeScreen from "./Screens/Cliente/Home/HomeScreen";
//import Navbar from "./Components/Navbar/Navbar";
import Journey from "./Screens/Cliente/Journey/Journey";
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
import { AuthContext } from "./AuthContext";

// Componente SplashScreen
//const SplashScreen = () => (
// <div className="App-header">
//   <img src={logo} className="App-logo" alt="logo" />
//   <p>Cargando...</p>
// </div>
//);

const ProtectedRoute = ({ children, ...rest }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    // Usuario no autenticado, redirige a la página de inicio de sesión
    return <Navigate to="/" />;
  }

  return children;
};

// Componente App con SplashScreen y rutas
function App() {
  //const [loading, setLoading] = useState(true);

  //useEffect(() => {
  //  const timer = setTimeout(() => setLoading(false), 3000); // Muestra el SplashScreen durante 3 segundos
  //  return () => clearTimeout(timer);
  // }, []);

  // if (loading) {
  //  return <SplashScreen />;
  //}

  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Legal" element={<Legal />} />
        <Route
          path="/HomeAdmin"
          element={
            <ProtectedRoute>
              <HomeAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/HomeScreen"
          element={
            <ProtectedRoute>
              <HomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/HomeTaxista"
          element={
            <ProtectedRoute>
              <HomeTaxista />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Journey"
          element={
            <ProtectedRoute>
              <Journey />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/ConversationMessage" element={<ConversationMessage />} />
        <Route
          path="/EditProfile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CallMessageConversationMessage"
          element={<CallMessageConversationMessage />}
        />

        <Route path="/ChatList" element={<ChatList />} />
        <Route path="/ChatMessage" element={<ChatMessage />} />
        <Route path="chat/:UsuarioId" element={<ChatConversationClient />} />
        <Route path="/chat/:chatId" element={<TaxiChatComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
