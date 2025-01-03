import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';  // Make sure CSS is imported

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Placement Management System</h1>
      <div className="home-grid">
        <Link to="/students" className="home-card">
          <div className="card-content">
            <h2>Student Management</h2>
            <p>Manage student records, applications, and placements</p>
            <div className="card-icon">
              <i className="fas fa-user-graduate"></i>
            </div>
          </div>
        </Link>

        <Link to="/companies" className="home-card">
          <div className="card-content">
            <h2>Company Management</h2>
            <p>Manage company profiles and recruitment drives</p>
            <div className="card-icon">
              <i className="fas fa-building"></i>
            </div>
          </div>
        </Link>

        <Link to="/placement-drives" className="home-card">
          <div className="card-content">
            <h2>Placement Drives</h2>
            <p>Track and manage placement drives and interviews</p>
            <div className="card-icon">
              <i className="fas fa-briefcase"></i>
            </div>
          </div>
        </Link>

        <Link to="/placement-dept" className="home-card">
          <div className="card-content">
            <h2>Placement Department</h2>
            <p>View statistics and manage department activities</p>
            <div className="card-icon">
              <i className="fas fa-chart-line"></i>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;