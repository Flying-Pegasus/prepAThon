import './App.css';
import { Routes, Route } from "react-router-dom";
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import Newpage from './pages/Newpage';
import ForgotPass from './pages/ForgotPass';



function App() {

  return (

    <div>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/profile" element={<Newpage/>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotpass" element={<ForgotPass />} />
      </Routes>
    </div>

  );
}

export default App;
