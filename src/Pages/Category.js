import React, { useEffect, useState } from "react";
import "./category.css";
import { Col, Row, Modal, Form, Toast } from "react-bootstrap";
import { FaEllipsisVertical, FaUpload } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  createCategoryApi,
  deleteCategoryApi,
  getCategoriesApi,
  updateCategoryApi,
} from "../services/allApi";
import HashLoader from "react-spinners/HashLoader";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../services/baseUrl";

function Category() {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error message
  const [showPopoverModal, setShowPopoverModal] = useState(false);
  const [showeditModal, setShoweditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const fetchCategories = async () => {
    setLoading(true); // Start loading
    const response = await getCategoriesApi();

    if (response.success) {
      setCategories(response.data); // Assuming response has `data` containing categories
      setLoading(false); // Stop loading
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
    navigate(`/subcategorybyid/${id}`);
  };

  const handleModalShow = () => {
    setShowModal(true);
    setShowPopoverModal(false);
  };

  const handleeditModalClose = () => {
    setShoweditModal(false);
    setShowPopoverModal(false);
  };
  const handleeditModalShow = () => {
    setShoweditModal(true);
    setShowPopoverModal(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (
      !categoryName ||
      !categoryDescription ||
      (!imageFile && !imagePreview)
    ) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName.trim());
    formData.append("description", categoryDescription.trim());
    formData.append("fileType", "subcategory");
    formData.append("userType", "admin");

    // Only append the image if a new file is selected
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      // Assuming the updateSubCategoryApi function requires the sub-category ID
      const response = await updateCategoryApi(selectedId, formData);

      if (response.success) {
        toast.success("Sub-category updated successfully");
        fetchCategories(); // Refresh the list of subcategories
        handleeditModalClose(); // Close the modal on success
      } else {
        toast.error(response.error || "Failed to update category");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };
  const handleModalClose = () => setShowModal(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const handleCategoryNameChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleCategoryDescriptionChange = (event) => {
    setCategoryDescription(event.target.value);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim() || !categoryDescription.trim() || !imageFile) {
      toast.error("Please fill in all required fields, including the image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName.trim());
    formData.append("description", categoryDescription.trim());
    formData.append("fileType", "category");
    formData.append("userType", "admin");
    formData.append("image", imageFile);

    console.log("FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await createCategoryApi(formData);
      if (response.success) {
        toast.success("Category added successfully!");
        fetchCategories();

        handleModalClose();
      } else {
        throw new Error(response.data.message || "Unexpected error occurred.");
      }
    } catch (error) {
      console.error(
        "Error adding category:",
        error.response?.data || error.message
      );
      toast.error(
        `Failed to add category: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the File object
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result); // Show preview
      reader.readAsDataURL(file);
    }
  };

  const handleModalClose2 = () => {
    setShowPopoverModal(false);
  };
  const [selectedCategory] = useState(null);

  const handleIconClick = (category, e) => {
    setCategoryName(category.name); // Sub-category name
    setCategoryDescription(category.description); // Sub-category description
    setImagePreview(`${BASE_URL}/uploads/${category.image}`); // Image URL
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
        <p onClick={handleeditModalShow} className="category-small-modal-p">
          Edit
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
        <Col md={2} className="d-flex justify-content-end">
          <button className="w-100 addoffer-button" onClick={handleModalShow}>
            Category
            <span className="ms-3">+</span>
          </button>
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
                onClick={() => handleNavigateToSub(category._id)} 
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
                      e.stopPropagation(); 
                      handleIconClick(category, e); 
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

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="category-modal-title">
            Add Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Category Name Field */}
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Category Name
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter Category name"
                    value={categoryName}
                    onChange={handleCategoryNameChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Category Description Field */}
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Category Description
                  </Form.Label>
                  <Form.Control
                    className="single-product-description"
                    as="textarea"
                    rows={3}
                    placeholder="Enter a description for the category"
                    value={categoryDescription}
                    onChange={handleCategoryDescriptionChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Image Upload Field */}
            <Row className="mt-4">
              <Col md={12}>
                <Form.Group style={{ cursor: "pointer" }}>
                  <Form.Label className="single-product-form-label">
                    Image (PNG or SVG 12px)
                  </Form.Label>
                  <div
                    className="position-relative"
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/png, image/svg+xml"
                      onChange={handleImageUpload}
                      style={{ display: "none", cursor: "pointer" }}
                    />
                    <Form.Control
                      style={{ cursor: "pointer" }}
                      as="input"
                      className="single-product-form"
                      type="text"
                      placeholder="Select an image"
                      value={imagePreview ? "Image selected" : ""}
                      readOnly
                      onClick={() =>
                        document.getElementById("file-upload").click()
                      }
                    />
                    <FaUpload
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </Form.Group>
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Category Preview"
                      className="img-thumbnail preview-image"
                    />
                  </div>
                )}
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        {/* Modal Footer */}
        <Modal.Footer>
          <Row className="w-100">
            <Col>
              <button
                className="w-100 category-model-cancel"
                onClick={handleModalClose}
              >
                Cancel
              </button>
            </Col>
            <Col>
              <button
                className="w-100 category-model-add"
                onClick={handleAddCategory}
              >
                Add Category
              </button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

      <Modal show={showeditModal} onHide={handleeditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="category-modal-title">
            Edit Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-with-scroll">
          <Form>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Category Name
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter Category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Description
                  </Form.Label>
                  <Form.Control
                    className="single-product-description"
                    as="textarea"
                    placeholder="Enter description"
                    rows={3}
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Image (PNG or SVG 12px)
                  </Form.Label>
                  <div className="position-relative">
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/png, image/svg+xml"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                    <Form.Control
                      style={{ cursor: "pointer" }}
                      as="input"
                      className="single-product-form"
                      type="text"
                      placeholder="Select an image"
                      value={imagePreview ? "Image selected" : ""}
                      readOnly
                      onClick={() =>
                        document.getElementById("file-upload").click()
                      }
                    />
                    <FaUpload
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </Form.Group>
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Category Preview"
                      className="img-thumbnail preview-image"
                    />
                  </div>
                )}
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Row className="w-100">
            <Col>
              <button
                className="w-100 category-model-cancel"
                onClick={handleeditModalClose}
              >
                Cancel
              </button>
            </Col>
            <Col>
              <button
                onClick={handleEditSubmit}
                className="w-100 category-model-add"
              >
                Save Changes
              </button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default Category;
