import React, { useEffect, useState } from "react";
import "./category.css";
import { Col, Row, Modal, Form, Toast } from "react-bootstrap";
import { FaEllipsisVertical, FaUpload } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import {createSubCategoryApi,deleteSubCategoryApi,getCategoriesApi,getSubCategoriesApi,updateSubCategoryApi} from "../services/allApi";
import HashLoader from "react-spinners/HashLoader";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../services/baseUrl";

function Subcategory() {
  const [showModal, setShowModal] = useState(false);
  const [subcategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error message
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [showPopoverModal, setShowPopoverModal] = useState(false);
  const [showeditModal, setShoweditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();
      if (response.success && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error(
          "Failed to fetch categories:",
          response.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const response = await getSubCategoriesApi();
      console.log(response); // Log the response to debug
      if (response.success && Array.isArray(response.data.subCategories)) {
        setSubCategories(response.data.subCategories); // Extract subCategories
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

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleModalShow = () => {
    setShowModal(true);
    setShowPopoverModal(false);
  };

  const handleeditModalClose = () => {
    setShoweditModal(false);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (
      !subCategoryName ||
      !selectedCategory ||
      !description ||
      (!imageFile && !imagePreview)
    ) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", subCategoryName.trim());
    formData.append("description", description.trim());
    formData.append("category", selectedCategory); // Send the category ID
    formData.append("fileType", "subcategory");
    formData.append("userType", "admin");

    // Only append the image if a new file is selected
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      // Assuming the updateSubCategoryApi function requires the sub-category ID
      const response = await updateSubCategoryApi(selectedId, formData);

      if (response.success) {
        toast.success("Sub-category updated successfully");
        fetchSubCategories(); // Refresh the list of subcategories
        handleeditModalClose(); // Close the modal on success
      } else {
        toast.error(response.error || "Failed to update sub-category");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  const handleModalClose = () => {
    setShowModal(false); // Closes the modal
    setSubCategoryName(""); // Resets the subcategory name field
    setDescription(""); // Resets the description field
    setImageFile(null);
    setSelectedCategory(""); // Resets the selected category field
    setImagePreview(null); // Clears the image file field
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!subCategoryName || !selectedCategory || !imageFile || !description) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", subCategoryName.trim());
    formData.append("description", description.trim());
    formData.append("category", selectedCategory);
    formData.append("fileType", "subcategory"); // Assuming this is required
    formData.append("userType", "admin"); // Assuming this is required
    formData.append("image", imageFile); // Attach the actual file
    console.log("FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    try {
      // Send API request
      const response = await createSubCategoryApi(formData);

      if (response.success) {
        toast.success("Sub-category created successfully");
        fetchSubCategories(); // Refresh categories list
        handleModalClose(); // Close the modal on success
      } else {
        toast.error(response.error || "Failed to create sub-category");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  const handleIconClick = (category, e) => {
    setSubCategoryName(category.name);
    setSelectedCategory(category.category?._id); 
    setDescription(category.description);
    setImagePreview(`${BASE_URL}/uploads/${category.image}`); 
    setSelectedId(category._id);

    setShowPopoverModal(true);
  };

  const handleeditModalShow = () => {
    setShoweditModal(true);
    setShowPopoverModal(false);
  };

  const handleModalClose2 = () => {
    setShowPopoverModal(false);
  };

  const handleView = () => {
    // Implement the action for viewing category details
    console.log("View category:", selectedCategory);
  };
  const handleDeleteModalClose = () => setShowDeleteModal(false);
  const handleDeleteModalShow = () => {
    setShowDeleteModal(true);
    setShowPopoverModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) {
      toast.error("No subcategory selected for deletion");
      return;
    }

    try {
      const response = await deleteSubCategoryApi(selectedId);

      if (response.success) {
        toast.success("Sub-category deleted successfully");
        fetchSubCategories(); // Refresh the list after deletion
        handleDeleteModalClose();
      } else {
        toast.error(response.error || "Failed to delete sub-category");
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
          Are you sure you want to delete this sub-category? This action cannot
          be undone.
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
          <p className="Product-heading">Sub Category</p>
        </Col>
        <Col md={2} className="d-flex justify-content-end">
          <button className="w-100 addoffer-button" onClick={handleModalShow}>
            Sub Category
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
      {deleteModal}

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="category-modal-title">
            Add Sub Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-with-scroll">
          <Form onSubmit={handleFormSubmit}>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Sub Category Name
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter Sub Category name"
                    value={subCategoryName}
                    onChange={(e) => setSubCategoryName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Select Category
                  </Form.Label>
                  <div className="dropdown-wrapper">
                    <Form.Control
                      className="single-product-form custom-dropdown"
                      as="select"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      aria-label="Select category"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Control>
                    <FaChevronDown className="dropdown-icon" />
                  </div>
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
                    className="single-product-form"
                    as="textarea"
                    placeholder="Enter description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                onClick={handleModalClose}
              >
                Cancel
              </button>
            </Col>
            <Col>
              <button
                className="w-100 category-model-add"
                onClick={handleFormSubmit}
              >
                Add Sub Category
              </button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

      <Modal show={showeditModal} onHide={handleeditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="category-modal-title">
            Edit Sub Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-with-scroll">
          <Form>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Sub Category Name
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter Sub Category name"
                    value={subCategoryName}
                    onChange={(e) => setSubCategoryName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Select Category
                  </Form.Label>
                  <div className="dropdown-wrapper">
                    <Form.Control
                      className="single-product-form custom-dropdown"
                      as="select"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      aria-label="Select category"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Control>
                    <FaChevronDown className="dropdown-icon" />
                  </div>
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
                    className="single-product-form"
                    as="textarea"
                    placeholder="Enter description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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

      <ToastContainer />
    </div>
  );
}

export default Subcategory;
