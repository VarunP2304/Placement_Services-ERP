import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    job_role: '',
    description: '',
    package: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/companies');
      if (response.data) {
        setCompanies(response.data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompanies([]);
      alert(error.response?.data?.error || 'Error fetching companies');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        const response = await axios.put(
          `http://localhost:5000/api/companies/${editingCompany.id}`, 
          formData
        );
        if (response.data.success) {
          alert('Company updated successfully!');
        }
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/companies', 
          formData
        );
        if (response.data.success) {
          alert('Company added successfully!');
        }
      }
      setFormData({
        name: '',
        job_role: '',
        description: '',
        package: ''
      });
      setEditingCompany(null);
      setShowForm(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.error || 'Error processing request');
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name || '',
      job_role: company.job_role || '',
      description: company.description || '',
      package: company.package || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await axios.delete(`http://localhost:5000/api/companies/${companyId}`);
        alert('Company deleted successfully!');
        fetchCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
        alert('Error deleting company');
      }
    }
  };

  return (
    <div className="page-container">
      <h1>Company Management</h1>
      
      <button 
        className="add-button"
        onClick={() => {
          setEditingCompany(null);
          setFormData({
            name: '',
            job_role: '',
            description: '',
            package: ''
          });
          setShowForm(true);
        }}
      >
        Add New Company
      </button>

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit} className="company-form">
            <h2>{editingCompany ? 'Edit Company' : 'Add New Company'}</h2>
            
            <div className="form-group">
              <label>Company Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={editingCompany}
              />
            </div>

            <div className="form-group">
              <label>Job Role:</label>
              <input
                type="text"
                name="job_role"
                value={formData.job_role}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Package (LPA):</label>
              <input
                type="number"
                name="package"
                value={formData.package}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit">
                {editingCompany ? 'Update Company' : 'Add Company'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingCompany(null);
                  setFormData({
                    name: '',
                    job_role: '',
                    description: '',
                    package: ''
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Package (LPA)</th>
              <th>Job Role</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(company => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.package}</td>
                <td>{company.job_role}</td>
                <td>{company.description}</td>
                <td>
                  <button onClick={() => handleEdit(company)}>Edit</button>
                  <button onClick={() => handleDelete(company.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CompanyPage;