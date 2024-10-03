import './App.css';
import { Routes, Route,Navigate } from "react-router-dom";
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import Newpage from './pages/Newpage';
import Profile from './components/Userprofile';
import {app} from "./pages/firebase"
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import StockaR from './search/react';

const auth = getAuth(app);

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });

  return (

    <div>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/profile" /> : <LoginPage />} />
        <Route path="/profile" element={<StockaR/>} />
        <Route path="/new" element={<Newpage/>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={user ? <Navigate to="/profile" /> : <LoginPage />} />
      </Routes>
    </div>

  );
}

export default App;
