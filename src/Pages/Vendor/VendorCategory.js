import React, { useEffect, useState } from "react";
import "../category.css";
import { Col, Row, Modal, Toast } from "react-bootstrap";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import HashLoader from "react-spinners/HashLoader";
import { toast, ToastContainer } from "react-toastify";
import { deleteCategoryApi, getVendorCategoriesApi } from "../../services/allApi";
import { BASE_URL } from "../../services/baseUrl";

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error message
  const [showPopoverModal, setShowPopoverModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const fetchCategories = async () => {
    setLoading(true); // Start loading
    const response = await getVendorCategoriesApi();

    if (response.success) {
      setCategories(response.data); // Assuming response has `data` containing categories
      setLoading(false); // Stop loadin
    } else {
      setError(response.error); // Set error if there is an issue
      setLoading(false); // Stop loading
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const navigate = useNavigate();

  const handleNavigateToSub = (id) => {
    navigate(`/vendorsubcategorybyid/${id}`);
  };




 
 




 

  const handleModalClose2 = () => {
    setShowPopoverModal(false);
  };
  const [selectedCategory] = useState(null);

  const handleIconClick = (category, e) => {

    setSelectedId(category._id);

    setShowPopoverModal(true);
  };

  const handleView = () => {
    console.log("View category:", selectedCategory);
  };
  const handleDeleteModalClose = () => setShowDeleteModal(false);

  const handleDeleteModalShow = () => {
    setShowDeleteModal(true);
    setShowPopoverModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) {
      toast.error("No category selected for deletion");
      return;
    }

    try {
      const response = await deleteCategoryApi(selectedId);

      if (response.success) {
        toast.success("Category deleted successfully");
        fetchCategories(); // Refresh the list after deletion
        handleDeleteModalClose();
      } else {
        toast.error(response.error || "Failed to delete Category");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  const popoverModal = (
    <Modal
      show={showPopoverModal}
      onHide={handleModalClose2}
      dialogClassName="custom-popover-modal"
      centered
    >
      <Modal.Body className="custom-popover-body">
        <p
          onClick={() => handleView(selectedCategory)}
          className="category-small-modal-p"
        >
          View Date
        </p>
        
        <p
          onClick={() => handleDeleteModalShow()}
          className="category-small-modal-p"
        >
          Remove
        </p>
      </Modal.Body>
    </Modal>
  );
  const deleteModal = (
    <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="category-modal-title">
          Confirm Deletion
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-with-scroll">
        <p className="delete-modal-text">
          Are you sure you want to delete this Category? This action cannot be
          undone.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Row className="w-100">
          <Col>
            <button
              className="w-100 category-model-cancel"
              onClick={handleDeleteModalClose}
            >
              Cancel
            </button>
          </Col>
          <Col>
            <button
              className="w-100 category-model-add"
              onClick={handleDeleteConfirm}
            >
              Delete
            </button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
  return (
    <div className="category">
      <Row className="d-flex justify-content-between align-items-center mb-4">
        <Col md={7}>
          <p className="Product-heading">Category</p>
        </Col>
      
      </Row>

      <div className="category-container">
        {/* Displaying a spinner when loading */}
        {loading ? (
          <div className="spinner-overlay">
            <HashLoader color="#36d7b7" size={60} />
          </div>
        ) : error ? (
          <Toast>
            <Toast.Body className="text-danger">
              {error} {/* Show the error message in a Toast */}
            </Toast.Body>
          </Toast>
        ) : (
          <Row className="category-row">
            {categories.map((category) => (
              <Col
                key={category.id}
                onClick={() => handleNavigateToSub(category._id)} // For navigation
                style={{ cursor: "pointer" }}
                md={2}
                className="category-card-wrapper"
              >
                <div className="category-card">
                  <img
                    src={`${BASE_URL}/uploads/${category.image}`}
                    alt={category.name}
                    className="category-image"
                  />
                  <div className="category-name">{category.name}</div>
                  <FaEllipsisVertical
                    className="category-icon"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents triggering the parent onClick
                      handleIconClick(category, e); // Handle icon-specific action
                    }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
      {popoverModal}
      {deleteModal}

     

    
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default Category;
