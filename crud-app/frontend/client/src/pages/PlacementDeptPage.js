import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

function PlacementDeptPage() {
  const [drives, setDrives] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    image: null
  });

  useEffect(() => {
    fetchDrives();
    fetchGallery();
  }, []);

  // Fetch placement drives
  const fetchDrives = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/placement-drives');
      setDrives(response.data);
    } catch (error) {
      console.error('Error fetching drives:', error);
      alert('Error fetching placement drives');
    }
  };

  // Fetch gallery images
  const fetchGallery = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gallery');
      setGallery(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      alert('Error fetching gallery images');
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('image', uploadForm.image);

    try {
      await axios.post('http://localhost:5000/api/gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Image uploaded successfully!');
      fetchGallery();
      setIsModalOpen(false);
      setUploadForm({ title: '', image: null });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };

  // Handle image delete
  const handleImageDelete = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await axios.delete(`http://localhost:5000/api/gallery/${imageId}`);
        alert('Image deleted successfully!');
        fetchGallery();
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Error deleting image');
      }
    }
  };

  return (
    <div className="page-container">
      <h1>Placement Department</h1>

      {/* Company Visits Section */}
      <section className="company-visits-section">
        <h2>Company Visits</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Visit Date</th>
                <th>Total Candidates</th>
                <th>Placed Candidates</th>
                <th>Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {drives.map((drive) => (
                <tr key={drive.id}>
                  <td>{drive.CompanyName}</td>
                  <td>{new Date(drive.date).toLocaleDateString()}</td>
                  <td>{drive.total_candidates}</td>
                  <td>{drive.placed_candidates}</td>
                  <td>
                    {drive.total_candidates 
                      ? `${((drive.placed_candidates / drive.total_candidates) * 100).toFixed(1)}%` 
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="gallery-header">
          <h2>Gallery</h2>
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            Add New Image
          </button>
        </div>

        <div className="gallery-grid">
          {gallery.map((item) => (
            <div key={item.id} className="gallery-item">
              <img 
                src={`http://localhost:5000/uploads/${item.image_url}`} 
                alt={item.title}
                onClick={() => setSelectedImage(item)}
              />
              <div className="gallery-item-overlay">
                <h3>{item.title}</h3>
                <button 
                  className="delete-button"
                  onClick={() => handleImageDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upload Image Modal */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleImageUpload} className="upload-form">
            <h2>Upload New Image</h2>
            
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadForm({...uploadForm, image: e.target.files[0]})}
                required
              />
            </div>

            <button type="submit">Upload Image</button>
          </form>
        </Modal>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <Modal onClose={() => setSelectedImage(null)}>
          <div className="image-preview">
            <img 
              src={`http://localhost:5000/uploads/${selectedImage.image_url}`} 
              alt={selectedImage.title} 
            />
            <h3>{selectedImage.title}</h3>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PlacementDeptPage;