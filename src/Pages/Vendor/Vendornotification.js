import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Modal, Row, Toast } from "react-bootstrap";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { CiImageOn } from "react-icons/ci";
import { IoEllipsisVertical } from "react-icons/io5";
import HashLoader from "react-spinners/HashLoader";
import { toast, ToastContainer } from "react-toastify";
import { createvendornotificationApi, deletevendornotificationapi, getvendornotificationApi, updatevendornotificationapi } from "../../services/allApi";
import '../notification.css'
function Vendornotification() {
  const [show, setShow] = useState(false);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [datetime, setDateTime] = useState(null);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [showeditModal, setShoweditModal] = useState(false);
  const [notificationId, setNotificationId] = useState("");
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

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const [openPopoverId, setOpenPopoverId] = useState(null); // Track which popover is open
  const popoverRefs = useRef({});

  const handleOpenPopover = (id, notification) => {
    setTitle(notification.title);
    setDescription(notification.description);
    setNotificationId(notification._id);
    setOpenPopoverId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Loop through all stored popover refs and check if click is outside
      for (const key in popoverRefs.current) {
        if (
          popoverRefs.current[key] &&
          !popoverRefs.current[key].contains(event.target)
        ) {
          setOpenPopoverId(null); // Close the popover if the click is outside
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRefs.current.left &&
        !popoverRefs.current.left.contains(event.target) &&
        popoverRefs.current.right &&
        !popoverRefs.current.right.contains(event.target)
      ) {
        setOpenPopoverId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchnotification = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getvendornotificationApi();
      console.log(response);

      if (response && response.data) {
        setNotification(response.data);
      }
    } catch (err) {
      setError("Failed to fetch offer. Please try again.");
      console.error("Error fetching offer data:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchnotification();
  }, []);

  // Helper to chunk data into rows of 2
  const chunkedNotifications = [];
  for (let i = 0; i < notification.length; i += 2) {
    chunkedNotifications.push(notification.slice(i, i + 2));
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!title || !description || !imageFile || !datetime) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("datetime", new Date(datetime).toISOString()); // Ensure date formatting
    formData.append("fileType", "notification"); // Assuming this is required
    formData.append("userType", "vendor"); // Assuming this is required
    formData.append("image", imageFile); // Attach the actual file

    console.log("FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      // Send API request
      const response = await createvendornotificationApi(formData);

      if (response.success) {
        toast.success("Slider created successfully");
        fetchnotification(); // Refresh slider list
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
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title || !description || !imageFile || !datetime) {
      toast.error("All fields are required");
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("datetime", new Date(datetime).toISOString()); // Ensure date formatting
    formData.append("fileType", "notification");
    formData.append("userType", "vendor");
    formData.append("image", imageFile);

    try {
      const response = await updatevendornotificationapi(notificationId, formData);
      console.log(response); // Debug response for issues

      if (response.success) {
        toast.success("Carousel updated successfully");
        fetchnotification();
        handleeditModalClose();
      } else {
        toast.error(response.error || "Failed to update carousel");
      }
    } catch (err) {
      console.error("Error:", err); // Log detailed error
      toast.error("An unexpected error occurred");
    }
  };

  const handleeditModalShow = () => {
    setShoweditModal(true);
    

  };
  const handleeditModalClose = () => {
    setShoweditModal(false);
  };
  const handleDeleteModalClose = () => setShowDeleteModal(false);
  const handleDeleteModalShow = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!notificationId) {
      toast.error("No subcategory selected for deletion");
      return;
    }

    try {
      const response = await deletevendornotificationapi(notificationId);

      if (response.success) {
        toast.success("Sub-category deleted successfully");
        fetchnotification(); // Refresh the list after deletion
        handleDeleteModalClose();
      } else {
        toast.error(response.error || "Failed to delete notification");
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
          Are you sure you want to delete this Notification This action cannot
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
    <div className="notification">
      <Row className="d-flex justify-content-between">
        <Col md={7}>
          <p className="Product-heading">Notifications</p>
        </Col>
        <Col md={2} className="d-flex justify-content-end">
          <button onClick={handleShow} className="w-100 addoffer-button">
            Notification
            <span className="ms-3">+</span>
          </button>
        </Col>
      </Row>

      <div>
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
          <div>
            {chunkedNotifications.map((row, rowIndex) => (
              <Row key={rowIndex} style={{ gap: "20px", marginBottom: "20px" }}>
                {row.map((notification) => (
                  <Col key={notification._id} className="position-relative">
                    <IoEllipsisVertical
                      className="position-absolute top-0 end-0 m-0"
                      onClick={() =>
                        handleOpenPopover(notification._id, notification)
                      } // Pass notification data
                      style={{ cursor: "pointer" }}
                    />

                    {openPopoverId === notification._id && ( // compare with _id here
                      <div className="custom-popover">
                        <div
                          className="popover-item"
                          onClick={handleDeleteModalShow}
                        >
                          Remove
                        </div>
                        <div
                          className="popover-item"
                          onClick={handleeditModalShow}
                        >
                          Edit
                        </div>
                      </div>
                    )}

                    <Row>
                      <Col
                        xs={4}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <div
                          className="d-flex align-items-center justify-content-center border"
                          style={{
                            height: "100%",
                            width: "100%",
                            backgroundColor: "#D9D9D9",
                            borderRadius: "10px",
                          }}
                        >
                          <CiImageOn size={32} />
                        </div>
                      </Col>
                      <Col xs={8}>
                        <h3 className="notification-title">
                          {notification.title}
                        </h3>
                        <p className="notification-subtitle">
                          {notification.description}
                        </p>
                        <p className="notification-date">
                          {notification.datetime}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                ))}
              </Row>
            ))}
          </div>
        )}
      </div>

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
            Add Notification
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                    <Form.Group>
                      <Form.Label className="single-product-form-label">
                        Description
                      </Form.Label>
                      <Form.Control
                        className="single-product-description"
                        as="textarea"
                        rows={3}
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Form.Group>
                        <Form.Label className="single-product-form-label">
                          Date and Time
                        </Form.Label>
                        <div className="input-with-icon">
                          <DateTimePicker
                            value={datetime}
                            onChange={(newValue) => setDateTime(newValue)}
                            style={{ border: "none" }}
                            PopperProps={{
                              disableScrollLock: true, // Prevent background scrolling when the popup is open
                              container: document.querySelector(
                                ".custom-modal-width"
                              ), // Ensure the popup is within the modal
                              modifiers: [
                                {
                                  name: "preventOverflow",
                                  options: {
                                    boundary: "viewport", // Keep the popup within the viewport
                                    rootBoundary: "viewport",
                                  },
                                },
                                {
                                  name: "flip",
                                  options: {
                                    fallbackPlacements: ["top", "bottom"], // Flip to top if there isn't enough space at the bottom
                                  },
                                },
                                {
                                  name: "offset",
                                  options: {
                                    offset: [0, -10], // Adjust the popup position slightly upward
                                  },
                                },
                              ],
                            }}
                            disablePortal // Render the popup inside the modal container
                            className="single-product-form datetime-picker"
                            viewRenderers={{
                              hours: renderTimeViewClock,
                              minutes: renderTimeViewClock,
                              seconds: renderTimeViewClock,
                            }}
                          />
                        </div>
                      </Form.Group>
                    </LocalizationProvider>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Row className="justify-content-center me-5">
            <Col md={6}>
              <button onClick={handleClose} className="offer-modal-cancel">
                Cancel
              </button>
            </Col>
            <Col md={6}>
              <button
                type="button"
                className="offer-modal-add"
                onClick={handleFormSubmit}
              >
                Add Notification
              </button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
      {deleteModal}
      {showModal && (
        <div className="modal2-overlay" onClick={handleCloseModal}>
          <div className="modal2">
            <p className="modal-option2" onClick={handleCloseModal}>
              Remov
            </p>
            <p className="modal-option2" onClick={handleCloseModal}>
              Edit
            </p>
          </div>
        </div>
      )}

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
            Edit Notification
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                    <Form.Group>
                      <Form.Label className="single-product-form-label">
                        Description
                      </Form.Label>
                      <Form.Control
                        className="single-product-description"
                        as="textarea"
                        rows={3}
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Form.Group>
                        <Form.Label className="single-product-form-label">
                          Date and Time
                        </Form.Label>
                        <div className="input-with-icon">
                          <DateTimePicker
                            value={datetime}
                            onChange={(newValue) => setDateTime(newValue)}
                            style={{ border: "none" }}
                            PopperProps={{
                              disableScrollLock: true, // Prevent background scrolling when the popup is open
                              container: document.querySelector(
                                ".custom-modal-width"
                              ), // Ensure the popup is within the modal
                              modifiers: [
                                {
                                  name: "preventOverflow",
                                  options: {
                                    boundary: "viewport", // Keep the popup within the viewport
                                    rootBoundary: "viewport",
                                  },
                                },
                                {
                                  name: "flip",
                                  options: {
                                    fallbackPlacements: ["top", "bottom"], // Flip to top if there isn't enough space at the bottom
                                  },
                                },
                                {
                                  name: "offset",
                                  options: {
                                    offset: [0, -10], // Adjust the popup position slightly upward
                                  },
                                },
                              ],
                            }}
                            disablePortal // Render the popup inside the modal container
                            className="single-product-form datetime-picker"
                            viewRenderers={{
                              hours: renderTimeViewClock,
                              minutes: renderTimeViewClock,
                              seconds: renderTimeViewClock,
                            }}
                          />
                        </div>
                      </Form.Group>
                    </LocalizationProvider>
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
                onClick={handleeditModalClose}
                className="offer-modal-cancel"
              >
                Cancel
              </button>
            </Col>
            <Col md={6}>
              <button
                type="button"
                className="offer-modal-add"
                onClick={handleEditSubmit}
              >
                Add Notification
              </button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default Vendornotification;
