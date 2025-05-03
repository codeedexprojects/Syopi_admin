import React, { useEffect, useRef, useState } from "react";
import "./notification.css";
import { Col, Form, Modal, Row, Toast } from "react-bootstrap";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { FiSend } from "react-icons/fi";
import {
  deletenotificationapi,
  getnotificationApi,
  getAdminOrdersApi,
  getallProducts,
  getCategoriesApi,
  getsubcategoryByID,
  getallUserApi,
  notifyUserApi,
  notifyAllUsersApi,
} from "../services/allApi";

import HashLoader from "react-spinners/HashLoader";
import { toast, ToastContainer } from "react-toastify";

function Notification() {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState("updation");
  const [productId, setProductId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [notificationId, setNotificationId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [notifyAll, setNotifyAll] = useState(true);
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const popoverRefs = useRef({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDeleteModalClose = () => setShowDeleteModal(false);
  const handleDeleteModalShow = () => setShowDeleteModal(true);

  // Get notification type display name
  const getNotificationTypeName = (type) => {
    switch (type) {
      case "updation":
        return "Update";
      case "offerOnProduct":
        return "Product Offer";
      case "offerOnCategory":
        return "Category Offer";
      case "order":
        return "Order";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getnotificationApi();
      if (response && response.data) {
        setNotification(response.data);
      }
    } catch (err) {
      setError("Failed to fetch notifications. Please try again.");
      console.error("Error fetching notification data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products for dropdown
  const fetchProducts = async () => {
    try {
      const response = await getallProducts();
      if (response && response.data) {
        setProducts(response.data.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();
      if (response && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch subcategories when category changes
  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    try {
      const response = await getsubcategoryByID(categoryId);
      if (response && response.data) {
        setSubcategories(response.data);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  // Fetch users for dropdown
  const fetchUsers = async () => {
    try {
      const response = await getallUserApi();
      if (response && response.data) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Fetch orders for dropdown
  const fetchOrders = async () => {
    try {
      const response = await getAdminOrdersApi();
      if (response && response.data) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchProducts();
    fetchCategories();
    fetchUsers();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchSubcategories(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      for (const key in popoverRefs.current) {
        if (
          popoverRefs.current[key] &&
          !popoverRefs.current[key].contains(event.target)
        ) {
          // Close any open popovers
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!title || !message || !notificationType) {
      toast.error("Title, message, and notification type are required");
      return;
    }

    // Create request payload based on notification type
    const payload = {
      title,
      message,
      notificationType,
    };

    // Add appropriate IDs based on notification type
    if (notificationType === "offerOnProduct" && productId) {
      payload.productId = productId;
    } else if (notificationType === "offerOnCategory" && categoryId) {
      payload.categoryId = categoryId;
      if (subCategoryId) payload.subCategoryId = subCategoryId;
    } else if (notificationType === "order" && userId) {
      payload.orderId = userId; // This will be used for order notifications
    }

    setSending(true);
    try {
      let response;
      if (notifyAll) {
        // Send to all users using the notifyAllUsersApi
        response = await notifyAllUsersApi(payload);
      } else {
        // Send to specific user
        if (!userId) {
          toast.error("Please select a user");
          setSending(false);
          return;
        }
        payload.userId = userId;
        response = await notifyUserApi(payload);
      }

      if (response && response.status === 200) {
        toast.success("Notification sent successfully");
        fetchNotifications();
        handleClose();
        resetForm();
      } else {
        toast.error(response?.data?.message || "Failed to send notification");
      }
    } catch (err) {
      console.error("Error creating notification:", err);
      toast.error(
        err.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!notificationId) {
      toast.error("No notification selected for deletion");
      return;
    }

    setDeleting(true);
    try {
      const response = await deletenotificationapi(notificationId);

      if (response && response.status === 200) {
        toast.success("Notification deleted successfully");
        fetchNotifications();
        handleDeleteModalClose();
      } else {
        toast.error(response?.data?.message || "Failed to delete notification");
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast.error(
        err.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setDeleting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setNotificationType("updation");
    setProductId("");
    setCategoryId("");
    setSubCategoryId("");
    setUserId("");
    setNotifyAll(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Format as "May 1, 2025 at 2:30 PM"
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    
    return date.toLocaleString('en-US', options);
  };

  // Calculate the time difference from now
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffDay > 0) {
      return diffDay === 1 ? "1 day ago" : `${diffDay} days ago`;
    } else if (diffHr > 0) {
      return diffHr === 1 ? "1 hour ago" : `${diffHr} hours ago`;
    } else if (diffMin > 0) {
      return diffMin === 1 ? "1 minute ago" : `${diffMin} minutes ago`;
    } else {
      return "Just now";
    }
  };

  // Render notification type fields based on selection
  const renderNotificationTypeFields = () => {
    switch (notificationType) {
      case "offerOnProduct":
        return (
          <Form.Group className="mb-3">
            <Form.Label className="notification-form-label">
              Product
            </Form.Label>
            <Form.Select
              className="notification-form-control"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        );

      case "offerOnCategory":
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label className="notification-form-label">
                Category
              </Form.Label>
              <Form.Select
                className="notification-form-control"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {categoryId && (
              <Form.Group className="mb-3">
                <Form.Label className="notification-form-label">
                  Subcategory (Optional)
                </Form.Label>
                <Form.Select
                  className="notification-form-control"
                  value={subCategoryId}
                  onChange={(e) => setSubCategoryId(e.target.value)}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcat) => (
                    <option key={subcat._id} value={subcat._id}>
                      {subcat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
          </>
        );

      case "order":
        return (
          <Form.Group className="mb-3">
            <Form.Label className="notification-form-label">Order</Form.Label>
            <Form.Select
              className="notification-form-control"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              <option value="">Select Order</option>
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  {order.orderId || order._id} -{" "}
                  {order.user?.name || "Unknown User"}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        );

      default:
        return null;
    }
  };

  // Render user selection when sending to specific user
  const renderUserSelection = () => {
    if (!notifyAll) {
      return (
        <Form.Group className="mb-3">
          <Form.Label className="notification-form-label">User</Form.Label>
          <Form.Select
            className="notification-form-control"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      );
    }
    return null;
  };

  const handleDeleteClick = (notificationItem) => {
    setNotificationId(notificationItem._id);
    handleDeleteModalShow();
  };

  return (
    <div className="notification-container">
      <Row className="notification-header">
        <Col md={8}>
          <h1 className="notification-heading">
            <IoNotificationsOutline className="notification-header-icon" />
            Notifications Management
          </h1>
          <p className="notification-subtitle">
            Send and manage notifications to your users
          </p>
        </Col>
        <Col md={4} className="notification-actions-wrapper">
          <button onClick={handleShow} className="notification-add-btn">
            <HiOutlineBellAlert className="notification-btn-icon" />
            New Notification
          </button>
        </Col>
      </Row>

      <div className="notification-content">
        {loading ? (
          <div className="notification-spinner">
            <HashLoader color="#404b69" size={40} />
          </div>
        ) : error ? (
          <div className="notification-error">
            <Toast className="notification-error-toast">
              <Toast.Body>{error}</Toast.Body>
            </Toast>
          </div>
        ) : notification.length === 0 ? (
          <div className="notification-empty">
            <div className="notification-empty-icon">
              <IoNotificationsOutline size={50} />
            </div>
            <p className="notification-empty-text">No notifications found</p>
            <button onClick={handleShow} className="notification-create-btn">
              Create Your First Notification
            </button>
          </div>
        ) : (
          <div className="notification-list">
            {notification.map((item) => (
              <div key={item._id} className="notification-item">
                <div className="notification-icon-wrapper">
                  <IoNotificationsOutline className="notification-icon" />
                </div>
                <div className="notification-body">
                  <h3 className="notification-title">{item.title}</h3>
                  <p className="notification-message">{item.message}</p>
                  <div className="notification-meta">
                    <span className="notification-type-badge">
                      {getNotificationTypeName(item.notificationType || "updation")}
                    </span>
                    <span className="notification-timestamp" title={formatDate(item.createdAt)}>
                      {getTimeAgo(item.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="notification-actions">
                  <button 
                    className="notification-delete-btn"
                    onClick={() => handleDeleteClick(item)}
                    aria-label="Delete notification"
                  >
                    <MdDelete className="notification-delete-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="notification-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="notification-modal-title">
            <HiOutlineBellAlert className="notification-modal-icon" />
            Send Notification
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="notification-form">
            <Row className="mb-4">
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="notification-form-label">Recipients</Form.Label>
                  <div className="notification-recipients">
                    <Form.Check
                      type="radio"
                      label="All Users"
                      name="notifyType"
                      id="notifyAll"
                      className="notification-recipient-option"
                      checked={notifyAll}
                      onChange={() => setNotifyAll(true)}
                    />
                    <Form.Check
                      type="radio"
                      label="Specific User"
                      name="notifyType"
                      id="notifyOne"
                      className="notification-recipient-option"
                      checked={!notifyAll}
                      onChange={() => setNotifyAll(false)}
                    />
                  </div>
                </Form.Group>

                {renderUserSelection()}
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="notification-form-label">
                Title
              </Form.Label>
              <Form.Control
                className="notification-form-control"
                type="text"
                placeholder="Enter notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="notification-form-label">
                Message
              </Form.Label>
              <Form.Control
                className="notification-form-control"
                as="textarea"
                rows={3}
                placeholder="Enter notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="notification-form-label">
                Notification Type
              </Form.Label>
              <Form.Select
                className="notification-form-control"
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value)}
              >
                <option value="updation">Update</option>
                <option value="order">Order</option>
                <option value="offerOnProduct">Offer On Product</option>
                <option value="offerOnCategory">Offer On Category</option>
              </Form.Select>
            </Form.Group>

            {renderNotificationTypeFields()}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Row className="w-100 notification-modal-actions">
            <Col xs={6} className="notification-modal-action">
              <button onClick={handleClose} className="notification-cancel-btn">
                Cancel
              </button>
            </Col>
            <Col xs={6} className="notification-modal-action">
              <button
                type="button"
                className="notification-submit-btn"
                onClick={handleFormSubmit}
                disabled={sending}
              >
                {sending ? (
                  <span className="notification-sending">Sending...</span>
                ) : (
                  <>
                    <FiSend className="notification-send-icon" />
                    Send Notification
                  </>
                )}
              </button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

    
      <Modal 
        show={showDeleteModal} 
        onHide={handleDeleteModalClose} 
        centered
        className="notification-delete-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="notification-modal-title">
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="notification-delete-confirmation">
            <div className="notification-delete-icon-wrapper">
              <MdDelete size={40} className="notification-delete-icon-large" />
            </div>
            <p className="notification-delete-message">
              Are you sure you want to delete this notification? This action cannot
              be undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Row className="w-100 notification-modal-actions">
            <Col xs={6} className="notification-modal-action">
              <button
                className="notification-cancel-btn"
                onClick={handleDeleteModalClose}
              >
                Cancel
              </button>
            </Col>
            <Col xs={6} className="notification-modal-action">
              <button
                className="notification-confirm-delete-btn"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default Notification;