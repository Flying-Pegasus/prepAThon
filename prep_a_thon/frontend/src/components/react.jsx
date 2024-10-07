
import React, { useState, useEffect } from 'react';
import './style.css';
import logo from "../pages/logo.png"
import profileIcon from "../pages/profile-icon.png"
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../pages/firebase"
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import Newpage from '../pages/Newpage';


const auth = getAuth(app);

const StockaR = () => {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchHistory, setSearchHistory] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    console.log("clicked")
    console.log(dropdownVisible)
  }


  const fetchUserData = async () => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Hi");
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          console.log(docSnap.data());
        } else {
          console.log("User is not logged in");
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  // Close dropdown if clicked outside
  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle search button click
  const handleSearch = () => {
    if (!companyName.trim()) {
      alert('Please enter a company name or code.');
      return;
    }

    setLoading(true);
    setSearchHistory([...searchHistory, companyName]); // Update search history
    startLoadingBar();

    // Simulate company data search after 2 seconds
    setTimeout(() => {
      stopLoadingBar();
      setInfoVisible(true);
    }, 2000);
  };

  const startLoadingBar = () => {
    let width = 0;
    const loadingInterval = setInterval(() => {
      if (width >= 100) {
        clearInterval(loadingInterval);
      } else {
        width++;
        setProgress(width);
      }
    }, 20);
  };

  const stopLoadingBar = () => {
    setLoading(false);
    setProgress(0);
  };

  return (
    <div className='fordiv'>
      <nav>
        <img id="logo" src={logo} alt="Logo" onClick={() => (window.location.href = '/profile')} />
        <h1 id="home-title">StockaR</h1>
        <div className="profile">
          <img
            id="profile-icon"
            src={profileIcon}
            alt="Profile"
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <div >
              <button>Your Profile</button>
              <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
            </div>

          )}
        </div>
        <div id="hamburger">&#9776;</div>
      </nav>

      <main className='formain'>
        <div id="search-container">
          <input
            type="text"
            id="company-input"
            placeholder="Enter Company Name/Code"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <button id="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        {loading && (
          <div id="loading-bar">
            <div id="progress" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {infoVisible && (
          <div id="info-boxes" style={{ display: 'flex' }}>
            <div className="info-box">
              <h3 id='boldTitle'>42</h3>
              <p>companies are in the same country</p>
            </div>
            <div className="info-box">
              <h3 id='boldTitle'>24</h3>
              <p>companies with greater diversity are in the same country</p>
            </div>
            <div className="info-box">
              <h3>Data</h3>
              <p>Stock price<br />Market share<br />Revenue<br />expense year by year</p>
            </div>
            <div className="info-box">
              <h3>Data</h3>
              <p>Stock price<br />Market share<br />Revenue<br />expense year by year</p>
            </div>
            <div className="info-box">
              <h3>Comment</h3>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat atque pariatur, libero aspernatur tenetur itaque amet. Repellat delectus, voluptate tenetur perferendis ex nihil explicabo deserunt atque blanditiis velit ad similique.</p>
            </div>
            <div className="info-box">
              <h3>prediction</h3>
            </div>
          </div>
        )}

        <div id="metrics-section" style={{ display: 'none' }}>
          <h2>Company Metrics</h2>
          <div className="metric-box">
            <p>Companies in the same country: <span id="same-country-count"></span></p>
          </div>
          <div className="metric-box">
            <p>Greater diversity companies: <span id="diversity-count"></span></p>
          </div>
          <div className="metric-box">
            <p>Stock Price Change: <span id="stock-price-change"></span></p>
          </div>
          <div className="metric-box">
            <p>Market Share Change: <span id="market-share-change"></span></p>
          </div>
          <div className="metric-box">
            <p>Predicted Stock Price: <span id="predicted-stock-price"></span></p>
          </div>
        </div>
      </main>

      <aside id="sidebar">
        <h2>Search History</h2>
        <ul id="history-list">
          {searchHistory.map((historyItem, index) => (
            <li key={index}>{historyItem}</li>
          ))}
        </ul>
      </aside>

    </div>
  );
};

export default StockaR;
