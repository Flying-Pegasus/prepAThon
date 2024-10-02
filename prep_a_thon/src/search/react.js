import React, { useState, useEffect } from 'react';
import './StockaR.css';

const StockaR = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchHistory, setSearchHistory] = useState([]);

  // Toggle dropdown visibility on profile icon click
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  // Close dropdown if clicked outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest('#profile-icon') && !e.target.closest('#dropdown-content')) {
        setDropdownVisible(false);
      }
    };
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
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
    <div>
      <header>
        <img id="logo" src="assets/logo.png" alt="Logo" onClick={() => (window.location.href = '/')} />
        <h1 id="home-title">StockaR</h1>
        <div className="profile">
          <img
            id="profile-icon"
            src="assets/profile-icon.jpg"
            alt="Profile"
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <div id="dropdown-content" className="dropdown-content">
              <button>Your Profile</button>
              <button>Logout</button>
            </div>
          )}
        </div>
        <div id="hamburger">&#9776;</div>
      </header>

      <main>
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
              <h3>Title 1</h3>
              <p>Line 1<br />Line 2<br />Line 3</p>
            </div>
            <div className="info-box">
              <h3>Title 2</h3>
              <p>Line 1<br />Line 2<br />Line 3</p>
            </div>
            <div className="info-box">
              <h3>Title 3</h3>
              <p>Line 1<br />Line 2<br />Line 3</p>
            </div>
            <div className="info-box">
              <h3>Title 4</h3>
              <p>Line 1<br />Line 2<br />Line 3</p>
            </div>
            <div className="info-box">
              <h3>Title 5</h3>
              <p>Line 1<br />Line 2<br />Line 3</p>
            </div>
            <div className="info-box">
              <h3>Title 6</h3>
              <p>Line 1<br />Line 2<br />Line 3</p>
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
