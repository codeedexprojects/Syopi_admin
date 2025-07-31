import React, { useState, useEffect } from 'react';
import { createTopPickProductApi, getsubcategoryByID, getAllTopPickProductsApi, getCategoriesApi, updateTopPickProductApi } from '../services/allApi';
import './TopPickProduct.css';
import { BASE_URL } from '../services/baseUrl';

function TopPickProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    image: null,
    imagePreview: null,
    productId: null
  });

  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
  }, []);

  // Filter subcategories when category changes
  useEffect(() => {
    if (formData.categoryId) {
      fetchSubcategories(formData.categoryId);
      // Reset subcategory selection when category changes
      setFormData(prev => ({ ...prev, subcategoryId: '' }));
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.categoryId]);

  // Fetch all products
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllTopPickProductsApi();
      
      if (response.status === 200 && response.data && response.data.topPickProducts) {
        setProducts(response.data.topPickProducts);
      } else if (response.success === false) {
        // Handle API error
        showNotification(response.error?.message || 'Failed to fetch products', 'danger');
      }
    } catch (error) {
      showNotification('Failed to fetch products', 'danger');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();
      
      if (response.status === 200 && response.data) {
        setCategories(response.data || []);
      } else {
      }
    } catch (error) {
    }
  };
  
  // Fetch subcategories based on category ID
  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await getsubcategoryByID(categoryId);
      
      if (response.status === 200 && response.data) {
        // Adjust this based on your API response structure
        setFilteredSubcategories(response.data.subCategories || response.data || []);
      } else {
        setFilteredSubcategories([]);
      }
    } catch (error) {
      setFilteredSubcategories([]);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      categoryId: '',
      subcategoryId: '',
      image: null,
      imagePreview: null,
      productId: null
    });
    setEditMode(false);
  };

  // Handle form submission for create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create FormData object for file upload
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append('categoryId', formData.categoryId);
    formDataObj.append('subcategoryId', formData.subcategoryId);
    if (formData.image) {
      formDataObj.append('image', formData.image);
    }

    try {
      if (editMode) {
        // Update existing product
        await updateTopPickProductApi(formData.productId, formDataObj);
        showNotification('Product updated successfully!', 'success');
      } else {
        // Create new product
        await createTopPickProductApi(formDataObj);
        showNotification('Product created successfully!', 'success');
      }
      
      resetForm();
      setShowForm(false);
      fetchAllProducts();
    } catch (error) {
      showNotification(error.response?.data?.message || 'An error occurred', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit product
  const handleEdit = (product) => {
    const categoryId = product.category?._id || product.category;
    const subcategoryId = product.subcategory?._id || product.subcategory;
    
    setFormData({
      title: product.title,
      description: product.description || '',
      categoryId: categoryId,
      subcategoryId: subcategoryId,
      image: null,
      imagePreview: `${BASE_URL}/uploads/${product.image}`, // Adjust path according to your setup
      productId: product._id
    });
    
    // Fetch subcategories for the selected category
    if (categoryId) {
      fetchSubcategories(categoryId);
    }
    
    setEditMode(true);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="page-title">Top Pick Products</h2>
            <button 
              className="btn btn-primary" 
              onClick={() => { resetForm(); setShowForm(!showForm); }}
            >
              {showForm ? 'Cancel' : 'Add New Product'}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Alert */}
      {notification.show && (
        <div className={`alert alert-${notification.type}`} role="alert">
          {notification.message}
        </div>
      )}

      {/* Form Section */}
      {showForm && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">{editMode ? 'Update Product' : 'Add New Product'}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title*</label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          id="description"
                          name="description"
                          rows="3"
                          value={formData.description}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="categoryId" className="form-label">Category*</label>
                        <select
                          className="form-select"
                          id="categoryId"
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(category => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="subcategoryId" className="form-label">Subcategory*</label>
                        <select
                          className="form-select"
                          id="subcategoryId"
                          name="subcategoryId"
                          value={formData.subcategoryId}
                          onChange={handleInputChange}
                          required
                          disabled={!formData.categoryId}
                        >
                          <option value="">Select Subcategory</option>
                          {filteredSubcategories.map(subcategory => (
                            <option key={subcategory._id} value={subcategory._id}>
                              {subcategory.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="image" className="form-label">Product Image*</label>
                        <input
                          type="file"
                          className="form-control"
                          id="image"
                          name="image"
                          accept="image/*"
                          onChange={handleImageChange}
                          required={!editMode}
                        />
                        <small className="text-muted">
                          {editMode ? 'Leave empty to keep current image' : 'Required'}
                        </small>
                      </div>
                      
                      {formData.imagePreview && (
                        <div className="mb-3 text-center">
                          <p>Image Preview:</p>
                          <img 
                            src={formData.imagePreview} 
                            alt="Preview" 
                            className="img-thumbnail product-image-preview" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end mt-3">
                    <button 
                      type="button" 
                      className="btn btn-secondary me-2" 
                      onClick={() => { resetForm(); setShowForm(false); }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : editMode ? 'Update Product' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Display Section */}
      <div className="row">
        {loading && !showForm ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No products found. Add your first top pick product!</p>
          </div>
        ) : (
          <>
            {products.map(product => (
              <div key={product._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 product-card shadow-sm">
                  <div className="card-img-container">
                    <img 
                      src={`${BASE_URL}/uploads/${product.image}`} 
                      className="card-img-top product-image" 
                      alt={product.title} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    {product.description && (
                      <p className="card-text description">{product.description}</p>
                    )}
                    <div className="category-badges mb-3">
                      {product.category && typeof product.category === 'object' ? (
                        <span className="badge bg-primary me-2">{product.category.name}</span>
                      ) : (
                        <span className="badge bg-primary me-2">Category ID: {product.category}</span>
                      )}
                      
                      {product.subcategory && typeof product.subcategory === 'object' ? (
                        <span className="badge bg-secondary">{product.subcategory.name}</span>
                      ) : (
                        <span className="badge bg-secondary">Subcategory ID: {product.subcategory}</span>
                      )}
                    </div>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">
                        Created: {new Date(product.createdAt).toLocaleDateString()}
                      </small>
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default TopPickProduct;