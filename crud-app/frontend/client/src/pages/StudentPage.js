import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentPage() {
  // State variables
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    USN: '',
    FName: '',
    MName: '',
    LName: '',
    PhNo: '',
    Email: '',
    Dept: '',
    AcademicYear: '',
    CGPA: '',
    BackLogs: '',
    offer_letter: null,
    internship_letter: null
  });

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Function to fetch students
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Error fetching students');
    }
  };

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files[0]
    }));
  };

  // Handle form submission (Add/Update student)
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'offer_letter' && key !== 'internship_letter') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append files if they exist
      if (formData.offer_letter) {
        formDataToSend.append('offer_letter', formData.offer_letter);
      }
      if (formData.internship_letter) {
        formDataToSend.append('internship_letter', formData.internship_letter);
      }
  
      if (editingStudent) {
        // Update existing student
        await axios.put(
          `http://localhost:5000/api/students/${editingStudent.USN}`,
          formDataToSend,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
        alert('Student updated successfully!');
      } else {
        // Add new student
        await axios.post(
          'http://localhost:5000/api/students',
          formDataToSend,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
        alert('Student added successfully!');
      }
  
      // Reset form and fetch updated list
      setFormData({
        USN: '',
        FName: '',
        MName: '',
        LName: '',
        PhNo: '',
        Email: '',
        Dept: '',
        AcademicYear: '',
        CGPA: '',
        BackLogs: '',
        offer_letter: null,
        internship_letter: null
      });
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };
  
  // Handle edit button click
  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      USN: student.USN,
      FName: student.FName,
      MName: student.MName || '',
      LName: student.LName,
      PhNo: student.PhNo,
      Email: student.Email,
      Dept: student.Dept,
      AcademicYear: student.AcademicYear,
      CGPA: student.CGPA,
      BackLogs: student.BackLogs,
      offer_letter: null,
      internship_letter: null
    });
  };
  
  // Handle delete button click
  const handleDelete = async (usn) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${usn}`);
        alert('Student deleted successfully!');
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student');
      }
    }
  };

  return (
    <div className="page-container">
      <h1>Student Management</h1>
      
      <div className="form-section">
        <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-row">
            <div className="form-group">
              <label>USN:</label>
              <input
                type="text"
                name="USN"
                value={formData.USN}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="FName"
                value={formData.FName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Middle Name:</label>
              <input
                type="text"
                name="MName"
                value={formData.MName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="LName"
                value={formData.LName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                name="PhNo"
                value={formData.PhNo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department:</label>
              <input
                type="text"
                name="Dept"
                value={formData.Dept}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Academic Year:</label>
              <input
                type="text"
                name="AcademicYear"
                value={formData.AcademicYear}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CGPA:</label>
              <input
                type="number"
                step="0.01"
                name="CGPA"
                value={formData.CGPA}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Backlogs:</label>
              <input
                type="number"
                name="BackLogs"
                value={formData.BackLogs}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Offer Letter:</label>
              <input
                type="file"
                name="offer_letter"
                onChange={handleFileChange}
              />
            </div>
            <div className="form-group">
              <label>Internship Letter:</label>
              <input
                type="file"
                name="internship_letter"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit">
              {editingStudent ? 'Update Student' : 'Add Student'}
            </button>
            {editingStudent && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingStudent(null);
                  setFormData({
                    USN: '',
                    FName: '',
                    MName: '',
                    LName: '',
                    PhNo: '',
                    Email: '',
                    Dept: '',
                    AcademicYear: '',
                    CGPA: '',
                    BackLogs: '',
                    offer_letter: null,
                    internship_letter: null
                  });
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>USN</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Academic Year</th>
              <th>CGPA</th>
              <th>Backlogs</th>
              <th>Documents</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.USN}>
                <td>{student.USN}</td>
                <td>{`${student.FName} ${student.MName || ''} ${student.LName}`}</td>
                <td>{student.Email}</td>
                <td>{student.PhNo}</td>
                <td>{student.Dept}</td>
                <td>{student.AcademicYear}</td>
                <td>{student.CGPA}</td>
                <td>{student.BackLogs}</td>
                <td>
                  {student.offer_letter && (
                    <a 
                      href={`http://localhost:5000/uploads/${student.offer_letter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Offer Letter
                    </a>
                  )}
                  <br></br>
                  {student.internship_letter && (
                    <a 
                      href={`http://localhost:5000/uploads/${student.internship_letter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Internship Letter
                    </a>
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(student)}>Edit</button>
                  <button onClick={() => handleDelete(student.USN)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentPage;