import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/LoginSignUp/Home';
import LoginPage from './pages/LoginSignUp/LoginPage';
import Signup from './pages/LoginSignUp/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/new" element={<Home />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
