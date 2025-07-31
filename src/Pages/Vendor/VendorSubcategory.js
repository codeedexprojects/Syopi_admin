import React, { useEffect, useState } from "react";
import "../category.css";
import { Col, Row, Modal, Toast } from "react-bootstrap";
import { FaEllipsisVertical } from "react-icons/fa6";
import { getVendorSubCategoriesApi } from "../../services/allApi";
import HashLoader from "react-spinners/HashLoader";
import { ToastContainer } from "react-toastify";
import { BASE_URL } from "../../services/baseUrl";

function VendorSubcategory() {
  const [subcategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error message

  const [showPopoverModal, setShowPopoverModal] = useState(false);

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const response = await getVendorSubCategoriesApi();
      if (response.success && Array.isArray(response.data)) {
        setSubCategories(response.data); // Extract subCategories
      } else {
        setError(response.error || "Invalid response format");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleIconClick = (category, e) => {
    setShowPopoverModal(true);
  };

  const handleModalClose2 = () => {
    setShowPopoverModal(false);
  };

  const popoverModal = (
    <Modal
      show={showPopoverModal}
      onHide={handleModalClose2}
      dialogClassName="custom-popover-modal"
      centered
    >
      <Modal.Body className="custom-popover-body">
        <p className="category-small-modal-p">View Date</p>
      </Modal.Body>
    </Modal>
  );

  return (
    <div className="category">
      <Row className="d-flex justify-content-between align-items-center mb-4">
        <Col md={7}>
          <p className="Product-heading">Sub Category</p>
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
            {subcategories.map((category) => (
              <Col
                style={{ cursor: "pointer" }}
                key={category._id}
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
                    onClick={() => handleIconClick(category)}
                  />
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
      {popoverModal}

      <ToastContainer />
    </div>
  );
}

export default VendorSubcategory;
