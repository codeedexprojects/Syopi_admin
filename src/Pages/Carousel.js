import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Modal, Row, Toast } from "react-bootstrap";
import "./carousel.css";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FaChevronDown } from "react-icons/fa";
import { FaEllipsis } from "react-icons/fa6";
import {
  createsliderApi,
  deletesliderApi,
  getallProducts,
  getSliderApi,
  updatesliderApi,
} from "../services/allApi";
import HashLoader from "react-spinners/HashLoader";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../services/baseUrl";

function Carousel() {
  const [show, setShow] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  // const [date, setDate] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [showeditModal, setShoweditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // Update the imageFile state
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result); // Preview image
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [popover, setPopover] = useState({ visible: false, x: 0, y: 0 });
  const popoverRef = useRef(null);
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  // 3. Add these helper functions
  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const getAvailableProducts = () => {
    return products.filter(
      (product) => !selectedProducts.includes(product._id)
    );
  };

const handleActionClick = (slider, event) => {
  event.stopPropagation();
  
  setPopover({
    visible: true,
    x: event.clientX,
    y: event.clientY,
    anchorPoint: "bottom"
  });

  // Set the slider data
  setTitle(slider.title);
  setSelectedProducts(slider.productIds?.map(product => product._id) || []);
  setUploadedImage(slider.image ? `${BASE_URL}/uploads/${slider.image}` : "");
  setSelectedId(slider._id);
};

  // Add this effect to adjust position after popover becomes visible
  useEffect(() => {
    if (popover.visible && popoverRef.current) {
      const popoverElement = popoverRef.current;
      const popoverRect = popoverElement.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate adjusted position to keep popover fully visible
      let adjustedX = popover.x;
      let adjustedY = popover.y;
      let anchorPoint = "bottom";

      // Adjust horizontal position if too close to right edge
      if (popover.x + popoverRect.width > windowWidth) {
        adjustedX = popover.x - popoverRect.width;
      }

      // Position popover above the click point if there's not enough space below
      if (popover.y + popoverRect.height > windowHeight) {
        adjustedY = popover.y - popoverRect.height;
        anchorPoint = "top";
      } else {
        // Add a small offset to position below the click point
        adjustedY = popover.y + 10;
      }

      // Ensure popover doesn't go off the left edge
      if (adjustedX < 0) {
        adjustedX = 10;
      }

      // Update popover position with calculated values
      setPopover((prev) => ({
        ...prev,
        x: adjustedX,
        y: adjustedY,
        anchorPoint,
      }));
    }
  }, [popover.visible]);

  // Click handler for document to close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setPopover((prev) => ({ ...prev, visible: false }));
      }
    };

    if (popover.visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popover.visible]);

  const handleClosePopover = () => {
    setPopover({ visible: false, x: 0, y: 0 });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        handleClosePopover();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchslider = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSliderApi();
      console.log(response);

      if (response && response.data) {
        setRows(response.data);
      }
    } catch (err) {
      setError("Failed to fetch offer. Please try again.");
      console.error("Error fetching offer data:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchslider();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getallProducts();

      if (response.success) {
        setProducts(response.data.products);
      } else {
        console.error(
          "Failed to fetch products:",
          response.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!title  || !selectedProducts.length === 0 || !imageFile) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    selectedProducts.forEach((productId) => {
      formData.append("productIds", productId);
    });
    // formData.append("date", new Date(date).toISOString());
    formData.append("userType", "admin"); // Assuming this is required
    formData.append("image", imageFile); // Attach the actual file

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      // Send API request
      const response = await createsliderApi(formData);

      if (response.success) {
        toast.success("Slider created successfully");
        fetchslider(); // Refresh slider list
        handleClose(); // Close the modal on success
      } else {
        // Display specific error details
        const errorMessage = response.error || "Failed to create slider";
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (err) {
      // Handle validation or unexpected errors
      if (err.response?.data?.error) {
        // Specific error from API
        toast.error(`Error: ${err.response.data.error}`);
      } else if (err.message) {
        // General error message
        toast.error(`Error: ${err.message}`);
      } else {
        // Fallback error message
        toast.error("An unexpected error occurred while creating the slider");
      }

      console.error("Error creating slider:", err);
    }
  };

  const handleeditModalShow = () => {
    setShoweditModal(true);
    handleClosePopover();
  };
  const handleeditModalClose = () => {
    setShoweditModal(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title  || selectedProducts.length === 0 || !imageFile) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    selectedProducts.forEach((productId) => {
      formData.append("productIds", productId);
    });
    // formData.append("date", date);
    // formData.append("fileType", "category");
    formData.append("userType", "admin");
    formData.append("image", imageFile);

    try {
      const response = await updatesliderApi(selectedId, formData);

      if (response.success) {
        toast.success("Carousel updated successfully");
        fetchslider();
        handleeditModalClose();
      } else {
        toast.error(response.error || "Failed to update carousel");
      }
    } catch (err) {
      console.error("Error:", err); // Log detailed error
      toast.error("An unexpected error occurred");
    }
  };

  const handleDeleteModalClose = () => setShowDeleteModal(false);
  const handleDeleteModalShow = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) {
      toast.error("No notification selected for deletion");
      return;
    }

    try {
      const response = await deletesliderApi(selectedId);

      if (response.success) {
        toast.success("Notification deleted successfully");
        fetchslider(); // Refresh the list after deletion
        handleDeleteModalClose();
      } else {
        toast.error(response.error || "Failed to delete Notification");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };
  const deleteModal = (
    <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="category-modal-title">
          Confirm Deletion
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-with-scroll">
        <p className="delete-modal-text">
          Are you sure you want to delete this Carousel? This action cannot be
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
    <div className="carousel">
      <Row className="d-flex justify-content-between">
        <Col md={7}>
          <p className="Product-heading">carousel slider</p>
        </Col>
        <Col md={2} className="d-flex justify-content-end">
          <button onClick={handleShow} className="w-100 addoffer-button">
            Add carousel
            <span className="ms-3">+</span>
          </button>
        </Col>
      </Row>

      <div className="coupon-table-container">
        {loading ? (
          <div className="spinner-overlay">
            <HashLoader color="#36d7b7" size={60} />
          </div>
        ) : error ? (
          <Toast>
            <Toast.Body className="text-danger">{error}</Toast.Body>
          </Toast>
        ) : (
          <TableContainer component={Paper} className="Dproduct">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="dproduct-tablehead">Image</TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Title
                  </TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Date
                  </TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Product
                  </TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <img
                        src={`${BASE_URL}/uploads/${row.image}`}
                        alt="Product"
                        style={{ width: "100px", height: "40px" }}
                      />
                    </TableCell>
                    <TableCell align="left" className="dproduct-tabledata">
                      {row.title}
                    </TableCell>
                    <TableCell align="left" className="dproduct-tabledata">
                      {row.createdAt}
                    </TableCell>
                   <TableCell align="left" className="dproduct-tabledata">
  {row.productIds?.map(product => product.name).join(', ') || "N/A"}
</TableCell>

                    <TableCell align="left" className="dproduct-tabledata">
                      <FaEllipsis
                        style={{ cursor: "pointer" }}
                        onClick={(event) => handleActionClick(row, event)} // Pass row data and event
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
     {popover.visible && (
  <div
    ref={popoverRef}
    className="custom-popover"
    style={{
      position: 'fixed',
      top: `${popover.y}px`,
      left: `${popover.x}px`,
      zIndex: 1000,
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      borderRadius: '4px',
      padding: '8px 0',
      minWidth: '120px'
    }}
  >
    <div 
      className="popover-item" 
      onClick={(e) => {
        e.stopPropagation();
        handleeditModalShow();
      }}
    >
      Edit
    </div>
    <div 
      className="popover-item"
      onClick={(e) => {
        e.stopPropagation();
        handleClosePopover();
      }}
    >
      View
    </div>
    <div 
      className="popover-item"
      onClick={(e) => {
        e.stopPropagation();
        handleDeleteModalShow();
      }}
    >
      Remove
    </div>
  </div>
)}
      {deleteModal}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="custom-modal-width"
        style={{ borderRadius: "22px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="category-modal-title">
            Add Carousel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
          <Row>
            <Col
              md={6}
              className="d-flex align-items-center justify-content-center"
            >
              <div
                className="upload-square"
                onClick={() => document.getElementById("image-upload").click()}
              >
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="img-fluid"
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                ) : (
                  <span className="upload-plus">+</span>
                )}
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </div>
            </Col>
            <Col md={6}>
              <Form>
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="single-product-form-label">
                        Title
                      </Form.Label>
                      <Form.Control
                        className="single-product-form"
                        type="text"
                        placeholder="Enter Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group controlId="productSelect">
                      <Form.Label className="single-product-form-label">
                        Products
                      </Form.Label>
                      <div className="carousel-multi-select-container">
                        <div
                          className="carousel-multi-select-display"
                          onClick={() => setShowAddDropdown(!showAddDropdown)}
                        >
                          {selectedProducts.length === 0 ? (
                            <span className="carousel-placeholder">
                              Select products...
                            </span>
                          ) : (
                            <div className="carousel-selected-items-container">
                              {selectedProducts.map((productId) => {
                                const product = products.find(
                                  (p) => p._id === productId
                                );
                                return (
                                  <span
                                    key={productId}
                                    className="carousel-selected-item"
                                  >
                                    {product?.name || "Unknown"}
                                    <span
                                      className="carousel-remove-item"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProducts(
                                          selectedProducts.filter(
                                            (id) => id !== productId
                                          )
                                        );
                                      }}
                                    >
                                      ×
                                    </span>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          <FaChevronDown className="carousel-dropdown-icon" />
                        </div>

                        {showAddDropdown && (
                          <div className="carousel-dropdown-list">
                            {getAvailableProducts().length === 0 ? (
                              <div className="carousel-dropdown-item">
                                No more products available
                              </div>
                            ) : (
                              getAvailableProducts().map((product) => (
                                <div
                                  key={product._id}
                                  className="carousel-dropdown-item"
                                  onClick={() => {
                                    toggleProductSelection(product._id);
                                    if (getAvailableProducts().length === 1) {
                                      setShowAddDropdown(false);
                                    }
                                  }}
                                >
                                  {product.name}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Row className="justify-content-center me-5">
            <Col md={6}>
              <button
                type="button"
                onClick={handleClose}
                className="offer-modal-cancel"
              >
                Cancel
              </button>
            </Col>
            <Col md={6}>
              <button
                type="button"
                onClick={handleFormSubmit}
                className="offer-modal-add"
              >
                Add Carousel
              </button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showeditModal}
        onHide={handleeditModalClose}
        backdrop="static"
        keyboard={false}
        className="custom-modal-width"
        style={{ borderRadius: "22px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="category-modal-title">
            Edit Carousel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
          <Row>
            <Col
              md={6}
              className="d-flex align-items-center justify-content-center"
            >
              <div
                className="upload-square"
                onClick={() => document.getElementById("image-upload").click()}
              >
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="img-fluid"
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                ) : (
                  <span className="upload-plus">+</span>
                )}
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </div>
            </Col>
            <Col md={6}>
              <Form>
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="single-product-form-label">
                        Title
                      </Form.Label>
                      <Form.Control
                        className="single-product-form"
                        type="text"
                        placeholder="Enter Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
               
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group controlId="productSelect">
                      <Form.Label className="single-product-form-label">
                        Products
                      </Form.Label>
                      <div className="carousel-multi-select-container">
                        <div
                          className="carousel-multi-select-display"
                          onClick={() => setShowAddDropdown(!showAddDropdown)}
                        >
                          {selectedProducts.length === 0 ? (
                            <span className="carousel-placeholder">
                              Select products...
                            </span>
                          ) : (
                            <div className="carousel-selected-items-container">
                              {selectedProducts.map((productId) => {
                                const product = products.find(
                                  (p) => p._id === productId
                                );
                                return (
                                  <span
                                    key={productId}
                                    className="carousel-selected-item"
                                  >
                                    {product?.name || "Unknown"}
                                    <span
                                      className="carousel-remove-item"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProducts(
                                          selectedProducts.filter(
                                            (id) => id !== productId
                                          )
                                        );
                                      }}
                                    >
                                      ×
                                    </span>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          <FaChevronDown className="carousel-dropdown-icon" />
                        </div>

                        {showAddDropdown && (
                          <div className="carousel-dropdown-list">
                            {getAvailableProducts().length === 0 ? (
                              <div className="carousel-dropdown-item">
                                No more products available
                              </div>
                            ) : (
                              getAvailableProducts().map((product) => (
                                <div
                                  key={product._id}
                                  className="carousel-dropdown-item"
                                  onClick={() => {
                                    toggleProductSelection(product._id);
                                    if (getAvailableProducts().length === 1) {
                                      setShowAddDropdown(false);
                                    }
                                  }}
                                >
                                  {product.name}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Row className="justify-content-center me-5">
            <Col md={6}>
              <button
                type="button"
                onClick={handleeditModalClose}
                className="offer-modal-cancel"
              >
                Cancel
              </button>
            </Col>
            <Col md={6}>
              <button
                type="button"
                onClick={handleEditSubmit}
                className="offer-modal-add"
              >
                Edit Carousel
              </button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

      <ToastContainer></ToastContainer>
    </div>
  );
}

export default Carousel;
