import React, { useState, useEffect } from "react";
import {
  createBrandApi,
  deleteBrandApi,
  getAllBrandsApi,
  updateBrandApi,
} from "../services/allApi";
import "./Brand.css";
import { BASE_URL } from "../services/baseUrl";

function Brand() {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: null,
    image: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all brands on component mount
  useEffect(() => {
    fetchBrands();
  }, []);

  // Update total pages when brands or items per page changes
useEffect(() => {
  const filtered = brands.filter((brand) => 
    brand?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );
  
  setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  
  if (currentPage > Math.ceil(filtered.length / itemsPerPage)) {
    setCurrentPage(1);
  }
}, [brands, itemsPerPage, searchTerm, currentPage]); 

  const fetchBrands = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllBrandsApi();

      setBrands(response.data);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      setError("Failed to load brands. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (brand) => {
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description,
      // We don't set the file objects here since they're not available from API response
      // Will only update if new files are selected
      logo: null,
      image: null,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create FormData object for file uploads
      const brandData = new FormData();
      brandData.append("name", formData.name);
      brandData.append("description", formData.description);

      if (formData.logo) {
        brandData.append("logo", formData.logo);
      }

      if (formData.image) {
        brandData.append("image", formData.image);
      }

      const newBrand = await createBrandApi(brandData);
      setBrands([newBrand, ...brands]);
      closeModal();
    } catch (error) {
      console.error("Failed to create brand:", error);
      setError("Failed to create brand. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create FormData object for file uploads
      const brandData = new FormData();
      brandData.append("name", formData.name);
      brandData.append("description", formData.description);

      // Only append files if they were selected
      if (formData.logo) {
        brandData.append("logo", formData.logo);
      }

      if (formData.image) {
        brandData.append("image", formData.image);
      }

      const updatedBrand = await updateBrandApi(selectedBrand._id, brandData);

      // Update local state
      setBrands(
        brands.map((brand) =>
          brand._id === selectedBrand._id ? updatedBrand : brand
        )
      );

      closeModal();
    } catch (error) {
      console.error("Failed to update brand:", error);
      setError("Failed to update brand. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteConfirmation = (brand) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setBrandToDelete(null);
  };

  const confirmDelete = async () => {
    if (brandToDelete) {
      setIsLoading(true);
      try {
        await deleteBrandApi(brandToDelete._id);
        setBrands(brands.filter((brand) => brand._id !== brandToDelete._id));
        closeDeleteModal();
      } catch (error) {
        console.error("Failed to delete brand:", error);
        setError("Failed to delete brand. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      logo: null,
      image: null,
    });
    setSelectedBrand(null);
    setError(null);
  };

  // Filter brands based on search term
const filteredBrands = brands.filter((brand) =>
  brand?.name?.toLowerCase().includes(searchTerm.toLowerCase())
);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="brand-dashboard">
      <div className="brand-header">
        <h1 className="brand-title">Brand Management</h1>
        <div className="brand-actions">
          <div className="brand-search">
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="brand-add-btn" onClick={openAddModal}>
            Add New Brand
          </button>
        </div>
      </div>

      {error && <div className="brand-error-message">{error}</div>}

      <div className="brand-table-container">
        {isLoading && !showModal && !showDeleteModal ? (
          <div className="brand-loading">Loading brands...</div>
        ) : (
          <>
            <table className="brand-table">
              <thead>
                <tr>
                  <th>SI NO</th>
                  <th>Logo</th>
                  <th>Brand Image</th>
                  <th>Brand</th>
                  <th>Description</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBrands.map((brand, index) => (
                  <tr key={brand._id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>
                      <div className="brand-logo">
                        {brand.logo ? (
                          <img
                            src={`${BASE_URL}/uploads/${brand.logo}`}
                            alt={`${brand.name} logo`}
                          />
                        ) : (
                          <div className="brand-no-image">Logo</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="brand-image">
                        {brand.image ? (
                          <img
                            src={`${BASE_URL}/uploads/${brand.image}`}
                            alt={brand.name}
                          />
                        ) : (
                          <div className="brand-no-image">No Image</div>
                        )}
                      </div>
                    </td>
                    <td className="brand-name">{brand.name}</td>
                    <td className="brand-description">{brand.description}</td>
                    <td className="brand-date">
                      {new Date(brand.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="brand-actions-cell">
                      <button
                        className="brand-edit-btn"
                        onClick={() => openEditModal(brand)}
                      >
                        Edit
                      </button>
                      <button
                        className="brand-delete-btn"
                        onClick={() => openDeleteConfirmation(brand)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBrands.length === 0 && !isLoading && (
              <div className="brand-empty-state">
                <p>No brands found. Add a new brand to get started.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredBrands.length > 0 && (
        <div className="brand-pagination">
          <div className="brand-pagination-info">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBrands.length)} of {filteredBrands.length} entries
          </div>
          
          <div className="brand-pagination-controls">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              className="brand-pagination-btn"
            >
              Previous
            </button>
            
            <div className="brand-pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`brand-pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              className="brand-pagination-btn"
            >
              Next
            </button>
          </div>
          
          <div className="brand-per-page-selector">
            <span>Show</span>
            <select 
              value={itemsPerPage} 
              onChange={handleItemsPerPageChange}
              className="brand-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>per page</span>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="brand-modal-overlay">
          <div className="brand-modal">
            <div className="brand-modal-header">
              <h2>{isEditing ? "Edit Brand" : "Add New Brand"}</h2>
              <button className="brand-modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="brand-modal-content">
              {error && <div className="brand-form-error">{error}</div>}

              <form onSubmit={isEditing ? handleUpdateBrand : handleAddBrand}>
                <div className="brand-form-group">
                  <label htmlFor="name">Brand Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="brand-form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="brand-form-group">
                  <label htmlFor="logo">Logo</label>
                  <div className="brand-file-input">
                    <input
                      type="file"
                      id="logo"
                      name="logo"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    {isEditing && selectedBrand.logo && !formData.logo && (
                      <div className="brand-current-file">
                        <span>Current logo: </span>
                        <img
                          src={`${BASE_URL}/uploads/${selectedBrand.logo}`}
                          alt="Current logo"
                          className="brand-preview-img"
                        />
                      </div>
                    )}
                    {formData.logo && (
                      <span className="brand-file-name">
                        {formData.logo.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="brand-form-group">
                  <label htmlFor="image">Brand Image</label>
                  <div className="brand-file-input">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    {isEditing && selectedBrand.image && !formData.image && (
                      <div className="brand-current-file">
                        <span>Current image: </span>
                        <img
                          src={`${BASE_URL}/uploads/${selectedBrand.image}`}
                          alt="Currentbrandimage"
                          className="brand-preview-img"
                        />
                      </div>
                    )}
                    {formData.image && (
                      <span className="brand-file-name">
                        {formData.image.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="brand-form-actions">
                  <button
                    type="button"
                    className="brand-cancel-btn"
                    onClick={closeModal}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="brand-submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Processing..."
                      : isEditing
                      ? "Update Brand"
                      : "Add Brand"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="brand-modal-overlay">
          <div className="brand-delete-modal">
            <div className="brand-modal-header">
              <h2>Confirm Deletion</h2>
              <button className="brand-modal-close" onClick={closeDeleteModal}>
                &times;
              </button>
            </div>
            <div className="brand-modal-content">
              {error && <div className="brand-form-error">{error}</div>}

              <p className="brand-delete-message">
                Are you sure you want to delete the brand{" "}
                <strong>{brandToDelete?.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="brand-form-actions">
                <button
                  className="brand-cancel-btn"
                  onClick={closeDeleteModal}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  className="brand-delete-confirm-btn"
                  onClick={confirmDelete}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Brand;