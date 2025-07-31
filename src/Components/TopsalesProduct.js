import React, { useState, useEffect } from 'react';
import { createTopSaleProductApi, getAllTopSaleProductsApi, getCategoriesApi, getsubcategoryByID, updateTopSaleProductApi } from '../services/allApi';
import { toast, ToastContainer } from 'react-toastify';
import './topsales.css';
import { BASE_URL } from '../services/baseUrl';

function TopsalesProduct() {
  const [categories, setCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [topSaleProducts, setTopSaleProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchTopSaleProducts();
  }, []);

  // Watch for category changes to fetch related subcategories
  useEffect(() => {
    if (formData.categoryId) {
      fetchSubcategoriesByCategoryId(formData.categoryId);
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.categoryId]);

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const fetchSubcategoriesByCategoryId = async (categoryId) => {
    if (!categoryId) return;
    
    try {
      setLoading(true);
      const response = await getsubcategoryByID(categoryId);
      
      if (response.data && response.data) {
        setFilteredSubcategories(response.data);
      } else {
        setFilteredSubcategories([]);
      }
      
      // Clear any previously selected subcategory
      setFormData(prev => ({ ...prev, subcategoryId: '' }));
    } catch (error) {
      toast.error('Failed to fetch subcategories');
      setFilteredSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopSaleProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllTopSaleProductsApi();
      
      setTopSaleProducts(response.data.topSaleSectionProducts);
    } catch (error) {
      toast.error('Failed to fetch top sale products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.categoryId) {
      toast.error('Category is required');
      return false;
    }
    if (!formData.subcategoryId) {
      toast.error('Subcategory is required');
      return false;
    }
    if (!editMode && !formData.image) {
      toast.error('Please upload an image');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('categoryId', formData.categoryId);
      data.append('subcategoryId', formData.subcategoryId);
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      let response;
      if (editMode) {
        response = await updateTopSaleProductApi(currentProductId, data);
        toast.success('Top sale product updated successfully');
      } else {
        response = await createTopSaleProductApi(data);
        toast.success('Top sale product created successfully');
      }

      // Reset form
      resetForm();
      fetchTopSaleProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setCurrentProductId(product._id);
    
    // First set the category ID
    const categoryId = product.category._id || product.category;
    
    setFormData({
      title: product.title,
      description: product.description || '',
      categoryId: categoryId,
      subcategoryId: product.subcategory._id || product.subcategory,
      image: null
    });
    
    // Fetch the subcategories for this category
    fetchSubcategoriesByCategoryId(categoryId);
    
    // Clear image preview
    setImagePreview(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      categoryId: '',
      subcategoryId: '',
      image: null
    });
    setImagePreview(null);
    setEditMode(false);
    setCurrentProductId(null);
    setFilteredSubcategories([]);
  };

  return (
    <div className="topsale-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="topsale-dashboard__wrapper">
        <h2 className="topsale-dashboard__title">Top Sales Management</h2>
        
        <div className="topsale-dashboard__grid">
          <div className="topsale-dashboard__form-section">
            <div className="topsale-card">
              <div className="topsale-card__header">
                <h3 className="topsale-card__title">
                  {editMode ? 'Edit Top Sale Product' : 'Add New Top Sale Product'}
                </h3>
              </div>
              
              <div className="topsale-card__body">
                <form onSubmit={handleSubmit} className="topsale-form">
                  <div className="topsale-form__group">
                    <label htmlFor="title" className="topsale-form__label">Title</label>
                    <input
                      type="text"
                      className="topsale-form__input"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter product title"
                    />
                  </div>
                  
                  <div className="topsale-form__group">
                    <label htmlFor="description" className="topsale-form__label topsale-form__label--optional">Description</label>
                    <textarea
                      className="topsale-form__textarea"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Enter product description (optional)"
                    ></textarea>
                  </div>
                  
                  <div className="topsale-form__group">
                    <label htmlFor="categoryId" className="topsale-form__label">Category</label>
                    <select
                      className="topsale-form__select"
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="topsale-form__group">
                    <label htmlFor="subcategoryId" className="topsale-form__label">Subcategory</label>
                    <select
                      className="topsale-form__select"
                      id="subcategoryId"
                      name="subcategoryId"
                      value={formData.subcategoryId}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.categoryId || filteredSubcategories.length === 0}
                    >
                      <option value="">Select Subcategory</option>
                      {filteredSubcategories.map((subcategory) => (
                        <option key={subcategory._id} value={subcategory._id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                    {!formData.categoryId && <p className="topsale-form__hint">Select a category first</p>}
                    {formData.categoryId && filteredSubcategories.length === 0 && !loading && (
                      <p className="topsale-form__hint">No subcategories found for this category</p>
                    )}
                  </div>
                  
                  <div className="topsale-form__group">
                    <label htmlFor="image" className="topsale-form__label">
                      {editMode ? 'Image (Leave empty to keep current)' : 'Image'}
                    </label>
                    <div className="topsale-form__file-wrapper">
                      <input
                        type="file"
                        className="topsale-form__file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </div>
                  </div>
                  
                  {imagePreview && (
                    <div className="topsale-form__group">
                      <label className="topsale-form__label">Image Preview</label>
                      <div className="topsale-form__preview">
                        <img src={imagePreview} alt="Preview" className="topsale-form__preview-img" />
                      </div>
                    </div>
                  )}
                  
                  <div className="topsale-form__actions">
                    <button 
                      type="submit" 
                      className="topsale-btn topsale-btn--primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="topsale-spinner" role="status" aria-hidden="true"></span>
                          <span className="topsale-btn__text">
                            {editMode ? 'Updating...' : 'Saving...'}
                          </span>
                        </>
                      ) : (
                        <span className="topsale-btn__text">
                          {editMode ? 'Update Product' : 'Add Product'}
                        </span>
                      )}
                    </button>
                    
                    {editMode && (
                      <button 
                        type="button" 
                        className="topsale-btn topsale-btn--secondary"
                        onClick={resetForm}
                      >
                        <span className="topsale-btn__text">Cancel</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="topsale-dashboard__list-section">
            <div className="topsale-card">
              <div className="topsale-card__header">
                <h3 className="topsale-card__title">Top Sale Products</h3>
              </div>
              
              <div className="topsale-card__body">
                {loading && !editMode ? (
                  <div className="topsale-loader">
                    <div className="topsale-spinner topsale-spinner--large"></div>
                    <p className="topsale-loader__text">Loading products...</p>
                  </div>
                ) : topSaleProducts.length > 0 ? (
                  <div className="topsale-table-wrapper">
                    <table className="topsale-table">
                      <thead className="topsale-table__head">
                        <tr>
                          <th className="topsale-table__header">Image</th>
                          <th className="topsale-table__header">Title</th>
                          <th className="topsale-table__header">Category</th>
                          <th className="topsale-table__header">Subcategory</th>
                          <th className="topsale-table__header">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="topsale-table__body">
                        {topSaleProducts.map((product) => (
                          <tr key={product._id} className="topsale-table__row">
                            <td className="topsale-table__cell">
                              <div className="topsale-product-img">
                                <img 
                                  src={`${BASE_URL}/uploads/${product.image}`} 
                                  alt={product.title} 
                                  className="topsale-product-img__thumbnail"
                                />
                              </div>
                            </td>
                            <td className="topsale-table__cell topsale-table__cell--title">
                              {product.title}
                            </td>
                            <td className="topsale-table__cell">
                              {product.category && product.category.name ? product.category.name : 'N/A'}
                            </td>
                            <td className="topsale-table__cell">
                              {product.subcategory && product.subcategory.name ? product.subcategory.name : 'N/A'}
                            </td>
                            <td className="topsale-table__cell">
                              <button 
                                className="topsale-btn topsale-btn--edit"
                                onClick={() => handleEdit(product)}
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="topsale-empty">
                    <p className="topsale-empty__message">No top sale products found</p>
                    <p className="topsale-empty__hint">Add your first product using the form</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopsalesProduct;