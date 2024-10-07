import React, { useState, useEffect } from 'react';
import './style.css';
import logo from "../pages/logo.png"

import profileicon from "../pages/profile-icon.png"
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
  const [countryName, setCountryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchHistory, setSearchHistory] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [data, setData] = useState({});

  // const toggleDropdown = () => {
  //   setDropdownVisible(!dropdownVisible);
  //   console.log("clicked")
  //   console.log(dropdownVisible)
  // }
  const toggleDropdown = () => setDropdownVisible((prev) => !prev);
  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);



  const fetchUserData = async () => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("User is not logged in");
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  async function handleLogout() {
    try {
      await signOut(auth);
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  const fetchDataBack = async () => {
    try {
      const response = await fetch('http://localhost:5000/search');
      const jsonData = await response.json();
      setData(jsonData);
      console.log(data.message);
    } catch (error) {
      console.log(error);
    }
  }

  // Close dropdown if clicked outside
  useEffect(() => {
    fetchUserData();
    fetchDataBack();
    const closeDropdownAndSidebar = (e) => {
      if (!e.target.closest('#profileicon') && dropdownVisible) {
        setDropdownVisible(false);
      }
      if (!e.target.closest('#hamburger') && !e.target.closest('#sidebar')) {
        setSidebarVisible(false);
      }
    };

    window.addEventListener('click', closeDropdownAndSidebar);
    return () => window.removeEventListener('click', closeDropdownAndSidebar);
  }, [dropdownVisible, sidebarVisible]);


  // Handle search button click
  const handleSearch = async (e) => {
    e.preventDefault();
    const searched = { companyName, countryName }; // Object containing company and country names

    // Validate input
    if (!companyName.trim() || !countryName.trim()) {
      alert('Please enter both company name and country.');
      return;
    }
    setLoading(true);
    const newHistory = [companyName, ...searchHistory];
    setSearchHistory(newHistory); // Set the updated history array
    startLoadingBar();

    try {
      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searched), // Sending company and country names
      });

      const result = await response.json();
      console.log(result.message); // Log the response from the backend

      // Handle further response logic here, such as updating UI or state
    } catch (error) {
      console.error('Error:', error);
    }
  
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
            id="profileicon"
            src={profileicon}
            alt="Profile"
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <div id="dropdown-content" className="dropdown-content">
              <p>{userDetails?.username}</p>
              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
        <div id="hamburger" onClick={toggleSidebar}>&#9776;</div>
      </nav>

      <main className='formain'>

        <div id="search-container">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              id="company-input"
              placeholder="Enter Company Name/Code"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
              type="text"
              id="company-input"
              placeholder="Enter Country"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
            />
            {/* <button id="search-btn" onClick={handleSearch}>
              Search
            </button> */}
            <button type="submit" id="search-btn">Search</button>
          </form>
        </div>

        {loading && (
          <div id="loading-bar">
            <div id="progress" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {infoVisible && (
          <div id="info-boxes" style={{ display: 'flex' }}>
            <div className="info-box">
              <h3 id='boldTitle'>{data.count_companies}</h3>
              <p>companies are in the same country</p>
            </div>
            <div className="info-box">
              <h3 id='boldTitle'>{data.diversity}</h3>
              <p>companies with greater diversity are in the same country</p>
            </div>
            <div className="info-box">
              <h3>Domestic Comparison Results:</h3>
              <p>Greater Stock Price: {data.compare[0]}<br />Greater Market Share: {data.compare[1]}<br />Greater Revenue: {data.compare[2]}<br />Greater Expense: {data.compare[3]}</p>
              <br />
              <h3>Global Comparison Results:</h3>
              <p>Greater Stock Price: {data.compare[4]}<br />Greater Market Share: {data.compare[5]}<br />Greater Revenue: {data.compare[6]}<br />Greater Expense: {data.compare[7]}</p>
            </div>
            <div className="info-box">
              <h3>Graphs</h3>
            </div>
            <div className="info-box">
              <h3>Analysis & Comments</h3>
              <p>Average Stock Price: {data.growth[0]}<br />Average Revenue: {data.growth[1]}<br />Average Market Share: {data.growth[2]}<br />Average Expense: {data.growth[3]}<br />Stock Price Growth:  {data.growth[4]}<br />Revenue Growth: {data.growth[5]}<br />Market Share Growth: {data.growth[6]}<br />Expense Growth: {data.growth[7]}<br />Comments:<br />{data.growth[8]}<br />{data.growth[9]}<br />{data.growth[10]}<br />{data.growth[11]}</p>
            </div>
            <div className="info-box">
              <h3>Prediction Analysis</h3>
              <p>Predicted Stock Price (2025): {data.Trained[0]}<br />Predicted Revenue (2025): {data.Trained[1]}<br />Predicted Market Share (2025): {data.Trained[2]}<br />Predicted Expense (2025): {data.Trained[3]}</p>
            </div>
          </div>
        )}
      </main>


      <aside id="sidebar" className={sidebarVisible ? 'open' : ''}>
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
