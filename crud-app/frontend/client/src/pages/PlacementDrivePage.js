import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../styles/PlacementDrivePage.css';

function PlacementDrivePage() {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    company_id: '',
    date: '',
    total_candidates: '',
    placed_candidates: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch both companies and drives when component mounts
  useEffect(() => {
    fetchCompanies();
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/placement-drives');
      console.log('Fetched drives:', response.data);
      setDrives(response.data.map(drive => ({
        ...drive,
        success_rate: drive.success_rate || 0
      })));
    } catch (error) {
      console.error('Error fetching drives:', error);
      setDrives([]);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompanies([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEdit = (drive) => {
    setEditMode(true);
    setEditId(drive.id);
    setFormData({
      company_id: drive.company_id,
      date: drive.date.split('T')[0], // Format date for input field
      total_candidates: drive.total_candidates,
      placed_candidates: drive.placed_candidates
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this drive?')) {
      try {
        await axios.delete(`http://localhost:5000/api/placement-drives/${id}`);
        alert('Drive deleted successfully!');
        fetchDrives(); // Refresh the list
      } catch (error) {
        console.error('Error:', error);
        alert(error.response?.data?.error || 'Error deleting drive');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/placement-drives/${editId}`, formData);
        alert('Drive updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/placement-drives', formData);
        alert('Drive added successfully!');
      }
      
      setFormData({
        company_id: '',
        date: '',
        total_candidates: '',
        placed_candidates: ''
      });
      setEditMode(false);
      setEditId(null);
      fetchDrives(); // Refresh the list to show updated success rates
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.error || `Error ${editMode ? 'updating' : 'adding'} drive`);
    }
  };

  return (
    <div className="page-container">
      <h1>Placement Drives</h1>

      {/* Drive Entry Form */}
      <div className="form-container">
        <h2>{editMode ? 'Edit Placement Drive' : 'Add New Placement Drive'}</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Company:</label>
            <select
              name="company_id"
              value={formData.company_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Company</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Total Candidates:</label>
            <input
              type="number"
              name="total_candidates"
              value={formData.total_candidates}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Placed Candidates:</label>
            <input
              type="number"
              name="placed_candidates"
              value={formData.placed_candidates}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>

          <div className="form-buttons">
            <button type="submit">{editMode ? 'Update Drive' : 'Add Drive'}</button>
            {editMode && (
              <button 
                type="button" 
                onClick={() => {
                  setEditMode(false);
                  setEditId(null);
                  setFormData({
                    company_id: '',
                    date: '',
                    total_candidates: '',
                    placed_candidates: ''
                  });
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Drive Records Table */}
      <div className="table-container">
        <h2>Placement Drive Records</h2>
        {drives.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Date</th>
                <th>Total Candidates</th>
                <th>Placed Candidates</th>
                <th>Success Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drives.map(drive => (
                <tr key={drive.id}>
                  <td>{drive.company_name}</td>
                  <td>{new Date(drive.date).toLocaleDateString()}</td>
                  <td>{drive.total_candidates}</td>
                  <td>{drive.placed_candidates}</td>
                  <td>{drive.success_rate ? `${Number(drive.success_rate).toFixed(1)}%` : '0%'}</td>
                  <td>
                    <button onClick={() => handleEdit(drive)}>Edit</button>
                    <button onClick={() => handleDelete(drive.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No placement drives found.</p>
        )}
      </div>
    </div>
  );
}

export default PlacementDrivePage;