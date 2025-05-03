import React, { useState, useEffect } from 'react';
import { 
  createrefferalOfferApi, 
  deleterefferalOfferApi, 
  getAllrefferalOffersApi, 
  getCoinSettingsApi, 
  updaterefferalOfferApi 
} from '../services/allApi';
import { Toast, ToastContainer } from 'react-bootstrap';
import './refferaloffer.css';
import { BASE_URL } from '../services/baseUrl';

function RefferOffer() {
  // State management
  const [referralOffers, setReferralOffers] = useState([]);
  const [coinSettings, setCoinSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coin: '',
    image: null
  });

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // Fetch all referral offers and coin settings on component mount
  useEffect(() => {
    fetchReferralOffers();
    fetchCoinSettings();
  }, []);

  // Fetch referral offers from API
  const fetchReferralOffers = async () => {
    setLoading(true);
    try {
      const response = await getAllrefferalOffersApi();
      console.log("refferal",response);
      
      if (response.data) {
        setReferralOffers(response.data.offerSections);
      }
    } catch (error) {
      showToast('Failed to fetch referral offers', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Fetch coin settings from API
  const fetchCoinSettings = async () => {
    try {
      const response = await getCoinSettingsApi();
      console.log("coin", response);
  
      if (response.data) {
        // wrap it in an array if it's a single object
        setCoinSettings([response.data]);
      }
    } catch (error) {
      showToast('Failed to fetch coin settings', 'danger');
    }
  };
  

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({
      show: true,
      message,
      type
    });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.title.trim()) {
      return showToast('Title is required', 'danger');
    }
    
    if (!formData.coin) {
      return showToast('Please select a coin', 'danger');
    }
    
    if (!formData.image && !isEditing) {
      return showToast('Please upload an image', 'danger');
    }

    // Create form data object for API
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append('coin', formData.coin);
    
    if (formData.image) {
      formDataObj.append('image', formData.image);
    }

    setLoading(true);
    try {
      let response;
      
      if (isEditing) {
        response = await updaterefferalOfferApi(currentId, formDataObj);
        showToast('Referral offer updated successfully');
      } else {
        response = await createrefferalOfferApi(formDataObj);
        showToast('Referral offer created successfully');
      }
      
      // Reset form and refresh data
      resetForm();
      fetchReferralOffers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Handle referral offer deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this referral offer?')) {
      setLoading(true);
      try {
        await deleterefferalOfferApi(id);
        showToast('Referral offer deleted successfully');
        fetchReferralOffers();
      } catch (error) {
        showToast('Failed to delete referral offer', 'danger');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle edit button click
  const handleEdit = (offer) => {
    setIsEditing(true);
    setCurrentId(offer._id);
    setFormData({
      title: offer.title,
      description: offer.description || '',
      coin: offer.coin,
      image: null // Image will only be updated if a new one is selected
    });
    setPreviewImage(`${BASE_URL}/uploads/${offer.image}`); // Assuming the image path structure
  };

  // Reset form and states
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      coin: '',
      image: null
    });
    setPreviewImage(null);
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <div className="referral-offer-container">
      {/* Toast notifications */}
      <ToastContainer position="top-end" className="p-3 position-fixed">
        <Toast 
          show={toast.show} 
          bg={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
          delay={3000}
          autohide
        >
          <Toast.Header closeButton>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className={toast.type === 'danger' ? 'text-white' : ''}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="row mb-4">
        <div className="col-12">
          <div className="admin-card">
            <div className="admin-card-header">
              <h4>{isEditing ? 'Edit Referral Offer' : 'Create New Referral Offer'}</h4>
            </div>
            <div className="admin-card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">Title <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control custom-input"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter offer title"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control custom-textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Enter offer description"
                      ></textarea>
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Select Coin <span className="text-danger">*</span></label>
                      <select
                        className="form-select custom-select"
                        name="coin"
                        value={formData.coin}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Select Coin --</option>
                        {coinSettings.map(coin => (
                          <option key={coin._id} value={coin._id}>
                            {coin.referralCoins || coin.symbol}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">Upload Image <span className="text-danger">*</span></label>
                      <input
                        type="file"
                        className="form-control custom-file-input"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      <small className="text-muted">Recommended size: 800x600px</small>
                    </div>

                    {previewImage && (
                      <div className="image-preview-container mb-3">
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="img-preview img-fluid"
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-12 mt-3">
                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-admin-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <span>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {isEditing ? 'Updating...' : 'Creating...'}
                          </span>
                        ) : (
                          isEditing ? 'Update Offer' : 'Create Offer'
                        )}
                      </button>
                      
                      {isEditing && (
                        <button
                          type="button"
                          className="btn btn-admin-secondary"
                          onClick={resetForm}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="admin-card">
            <div className="admin-card-header">
              <h4>Manage Referral Offers</h4>
            </div>
            <div className="admin-card-body">
              {loading && !referralOffers.length ? (
                <div className="text-center my-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : referralOffers.length === 0 ? (
                <div className="no-data-container">
                  <i className="bi bi-exclamation-circle"></i>
                  <p>No referral offers found. Create your first one!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Coin</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referralOffers.map(offer => (
                        <tr key={offer._id}>
                          <td>
                            <img
                              src={`${BASE_URL}/uploads/${offer.image}`}
                              alt={offer.title}
                              className="table-thumbnail"
                            />
                          </td>
                          <td>{offer.title}</td>
                          <td>
                            {offer.description ? (
                              offer.description.length > 50 ? 
                                `${offer.description.substring(0, 50)}...` : 
                                offer.description
                            ) : (
                              <span className="text-muted">No description</span>
                            )}
                          </td>
                          <td>
                            {offer.coin?.referralCoins || offer.coin?.symbol || (
                              <span className="text-muted">Unknown</span>
                            )}
                          </td>
                          <td>
                            {new Date(offer.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn btn-admin-edit btn-sm"
                                onClick={() => handleEdit(offer)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-admin-delete btn-sm"
                                onClick={() => handleDelete(offer._id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RefferOffer;