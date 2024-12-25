import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sgpa: '',
    accepted_company: '',
  });
  const [offerLetter, setOfferLetter] = useState(null);
  const [internshipLetter, setInternshipLetter] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setSubmitStatus({ message: 'Failed to fetch students', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      tempErrors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.name.trim())) {
      tempErrors.name = 'Name should be 2-50 characters long and contain only letters';
    }

    // Email validation
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Invalid email format';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = 'Phone should be 10 digits';
    }

    // CGPA validation
    if (!formData.sgpa) {
      tempErrors.sgpa = 'CGPA is required';
    } else if (formData.sgpa < 0 || formData.sgpa > 10) {
      tempErrors.sgpa = 'CGPA should be between 0 and 10';
    }

    // Company validation
    if (!formData.accepted_company.trim()) {
      tempErrors.accepted_company = 'Company name is required';
    }

    // File validation
    if (!editingId && !offerLetter) {
      tempErrors.offerLetter = 'Offer letter is required';
    }
    if (!editingId && !internshipLetter) {
      tempErrors.internshipLetter = 'Internship letter is required';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus({ message: 'Please fix the errors in the form', type: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name.trim());
      formDataToSubmit.append('email', formData.email.trim());
      formDataToSubmit.append('phone', formData.phone.trim());
      formDataToSubmit.append('sgpa', formData.sgpa);
      formDataToSubmit.append('accepted_company', formData.accepted_company.trim());

      if (offerLetter) {
        formDataToSubmit.append('offer_letter', offerLetter);
      }
      if (internshipLetter) {
        formDataToSubmit.append('internship_letter', internshipLetter);
      }

      if (editingId) {
        await axios.put(`http://localhost:5000/api/students/${editingId}`, formDataToSubmit);
        setSubmitStatus({ message: 'Student updated successfully!', type: 'success' });
      } else {
        await axios.post('http://localhost:5000/api/students', formDataToSubmit);
        setSubmitStatus({ message: 'Student added successfully!', type: 'success' });
      }
      
      await fetchStudents();
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ 
        message: `Error: ${error.response?.data?.message || 'Something went wrong'}`, 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      sgpa: '',
      accepted_company: '',
    });
    setOfferLetter(null);
    setInternshipLetter(null);
    setEditingId(null);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        setIsLoading(true);
        await axios.delete(`http://localhost:5000/api/students/${id}`);
        setSubmitStatus({ message: 'Student deleted successfully!', type: 'success' });
        await fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        setSubmitStatus({ message: 'Failed to delete student', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      sgpa: student.sgpa,
      accepted_company: student.accepted_company,
    });
    setEditingId(student.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors({ ...errors, [type]: 'Only PDF files are allowed' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, [type]: 'File size should be less than 5MB' });
        return;
      }
      if (type === 'offer_letter') {
        setOfferLetter(file);
      } else if (type === 'internship_letter') {
        setInternshipLetter(file);
      }
      // Clear error for this field if it exists
      const newErrors = { ...errors };
      delete newErrors[type];
      setErrors(newErrors);
    }
  };

  return (
    <div className="App">
      <h1>Placement Services CRUD Application</h1>
      
      {submitStatus.message && (
        <div className={`status-message ${submitStatus.type}`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            id="phone"
            type="text"
            placeholder="Enter 10-digit phone number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="sgpa">Current CGPA [till 6th Semester]:</label>
          <input
            id="sgpa"
            type="number"
            step="0.01"
            placeholder="Enter Current CGPA (0-10)"
            value={formData.sgpa}
            onChange={(e) => setFormData({ ...formData, sgpa: e.target.value })}
            className={errors.sgpa ? 'error' : ''}
          />
          {errors.sgpa && <span className="error-message">{errors.sgpa}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="company">Accepted Company:</label>
          <input
            id="company"
            type="text"
            placeholder="Enter company name"
            value={formData.accepted_company}
            onChange={(e) => setFormData({ ...formData, accepted_company: e.target.value })}
            className={errors.accepted_company ? 'error' : ''}
          />
          {errors.accepted_company && (
            <span className="error-message">{errors.accepted_company}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="offerLetter">Offer Letter (PDF):</label>
          <input
            id="offerLetter"
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, 'offer_letter')}
            className={errors.offerLetter ? 'error' : ''}
          />
          {errors.offerLetter && (
            <span className="error-message">{errors.offerLetter}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="internshipLetter">Internship Letter (PDF):</label>
          <input
            id="internshipLetter"
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, 'internship_letter')}
            className={errors.internshipLetter ? 'error' : ''}
          />
          {errors.internshipLetter && (
            <span className="error-message">{errors.internshipLetter}</span>
          )}
        </div>

        <div className="button-group">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : editingId ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={resetForm} disabled={isLoading}>
            Clear
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Current CGPA [till 6th Semester]</th>
              <th>Accepted Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No students found</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.sgpa}</td>
                  <td>{student.accepted_company}</td>
                  <td>
                    <button onClick={() => handleEdit(student)}>Edit</button>
                    <button 
                      onClick={() => handleDelete(student.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;