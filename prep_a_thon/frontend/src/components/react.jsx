import React, { useState, useEffect } from 'react';
import './style.css';
import logo from "../pages/logo.png"

import profileicon from "../pages/profile-icon.png"
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../pages/firebase"
import { doc, getDoc } from "firebase/firestore";
import {Chart as ChartJS} from "chart.js/auto"
import {Line} from "react-chartjs-2"


const auth = getAuth(app);

const StockaR = () => {
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
  }, [dropdownVisible, sidebarVisible,companyName]);


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
              <h2>Domestic Comparison Results:</h2>
              <p><b>Greater Stock Price:</b> {data.compare[0]}<br /><b>Greater Market Share:</b> {data.compare[1]}<br /><b>Greater Revenue:</b> {data.compare[2]}<br /><b>Greater Expense:</b> {data.compare[3]}</p>
              <br />
              <h2>Global Comparison Results:</h2>
              <p><b>Greater Stock Price:</b> {data.compare[4]}<br /><b>Greater Market Share:</b> {data.compare[5]}<br /><b>Greater Revenue:</b> {data.compare[6]}<br /><b>Greater Expense:</b> {data.compare[7]}</p>
            </div>
            <div className="info-box">
              <h2>Graphs</h2>
{/*               
              <Line
              data={{
                labels: [null,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],
                datasets: [{
                  label: `Stock Price for ${data.company} (2015-2024) in $`,
                  data: [null,data.plot.Revenue[0],data.plot.Revenue[1],data.plot.Revenue[2],data.plot.Revenue[3],data.plot.Revenue[4],data.plot.Revenue[5],data.plot.Revenue[6],data.plot.Revenue[7],data.plot.Revenue[8],data.plot.Revenue[9]],
                  fill: false,
                  borderColor: 'rgb(0,0,0)',
                  tension: 0
                }]
              }}/>
              <br/>
              <br/>
              <Line
              data={{
                labels: [null,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],
                datasets: [{
                  label: `Revenue of ${data.company} (2015-2024) in $`,
                  data: [null,data.plot.Revenue[0],data.plot.Revenue[1],data.plot.Revenue[2],data.plot.Revenue[3],data.plot.Revenue[4],data.plot.Revenue[5],data.plot.Revenue[6],data.plot.Revenue[7],data.plot.Revenue[8],data.plot.Revenue[9]],
                  fill: false,
                  borderColor: 'rgb(0,0,0)',
                  tension: 0,
                  backgroundColor: 'rgba(100,0,0)',
                }]
              }}/>
              <br/>
              <br/>
              <Line
              data={{
                labels: [null,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],
                datasets: [{
                  label: `Market Share for ${data.company} (2015-2024)`,
                  data: [65, 59, 80, 81, 56, 55, 40],
                  fill: false,
                  borderColor: 'rgb(0,0,0)',
                  tension: 0,
                  backgroundColor: 'rgba(100,0,0)',
                }]
              }}/>
              <br/>
              <br/>
              <Line
              data={{
                labels: [null,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],
                datasets: [{
                  label: `Expense for ${data.company} (2015-2024)`,
                  data: [65, 59, 80, 81, 56, 55, 40],
                  fill: false,
                  borderColor: 'rgb(0,0,0)',
                  tension: 0,
                  backgroundColor: 'rgba(100,0,0)',
                }]
              }}/> */}
            </div>
            <div className="info-box">
              <h2>Analysis & Comments</h2><br/>
              <p><b>Average Stock Price:</b> {data.growth[0]} B<br /><b>Average Revenue:</b> {data.growth[1]} M<br /><b>Average Market Share:</b> {data.growth[2]} %<br /><b>Average Expense:</b> {data.growth[3]} M<br /><b>Stock Price Growth:</b>  {data.growth[4]} %<br /><b>Revenue Growth:</b> {data.growth[5]} %<br /><b>Market Share Growth:</b> {data.growth[6]} %<br /><b>Expense Growth:</b> {data.growth[7]} %<br /><br /><b>Comments:</b><br />{data.growth[8]}<br />{data.growth[9]}<br />{data.growth[10]}<br />{data.growth[11]}</p>
            </div>
            <div className="info-box">
              <h2>Prediction Analysis</h2><br/>
              <p><b>Predicted Stock Price (2025):</b> {data.Trained[0]} B<br /><b>Predicted Revenue (2025):</b> {data.Trained[1]} M<br /><b>Predicted Market Share (2025):</b> {data.Trained[2]} %<br /><b>Predicted Expense (2025):</b> {data.Trained[3]} M</p>
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
