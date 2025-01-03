import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './pages/Home';  // Import Home component
import StudentPage from './pages/StudentPage';
import CompanyPage from './pages/CompanyPage';
import PlacementDrivePage from './pages/PlacementDrivePage';
import PlacementDeptPage from './pages/PlacementDeptPage';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />  {/* Set Home as the default route */}
          <Route path="/home" element={<Home />} />  {/* Also add explicit /home route */}
          <Route path="/students" element={<StudentPage />} />
          <Route path="/companies" element={<CompanyPage />} />
          <Route path="/placement-drives" element={<PlacementDrivePage />} />
          <Route path="/placement-dept" element={<PlacementDeptPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;