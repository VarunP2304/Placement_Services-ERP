import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Placement Management System
      </Link>
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/students">Students</Link>
        <Link to="/companies">Companies</Link>
        <Link to="/placement-drives">Placement Drives</Link>
        <Link to="/placement_dept">Placement Department</Link>
      </div>
    </nav>
  );
}

export default Navbar;