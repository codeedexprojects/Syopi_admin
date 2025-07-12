import * as React from "react";
import "./products.css";
import "./managevendors.css";
import { Col, Row, Card, Form, FormControl, Toast, ToastContainer, Dropdown } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { Pagination } from "@mui/material";
import { AiFillStar, AiOutlineShopping } from "react-icons/ai";
import { FaMapMarkerAlt, FaEllipsisV, FaCheck, FaTimes, FaClock } from "react-icons/fa";
import { MdBusiness } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getallVendors, updateVendorStatusApi } from "../services/allApi";
import { useState } from "react";
import { useEffect } from "react";
import { BASE_URL } from "../services/baseUrl";
import HashLoader from "react-spinners/HashLoader";

function Managevendors() {
  const navigate = useNavigate();

  const handleNavigation = (id) => {
    navigate(`/vendorprofile/${id}`);
  };

  const handleaddNavigation = () => {
    navigate("/addvendor");
  };

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingVendors, setUpdatingVendors] = useState(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // success, error, warning

  const vendorsPerPage = 10;
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;

  const fetchvendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getallVendors();
      console.log(response);

      if (response && response.data) {
        setVendors(response.data);
      }
    } catch (err) {
      setError("Failed to fetch vendors. Please try again.");
      console.error("Error fetching vendor data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchvendors();
  }, []);

  // Show toast notification
  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Update vendor status
  const handleStatusUpdate = async (vendorId, newStatus) => {
    // Prevent updating if already in progress
    if (updatingVendors.has(vendorId)) {
      return;
    }

    // Add vendor to updating set
    setUpdatingVendors(prev => new Set([...prev, vendorId]));

    try {
      const response = await updateVendorStatusApi(vendorId, newStatus);
      
      // Handle different response structures
      if (response && (response.success === true || response.status === 200 || !response.success === false)) {
        // Update vendor status in local state
        setVendors(prevVendors => 
          prevVendors.map(vendor => 
            vendor._id === vendorId 
              ? { ...vendor, status: newStatus }
              : vendor
          )
        );

        // Show success toast
        const statusText = newStatus === 'approved' ? 'approved' : 
                          newStatus === 'rejected' ? 'rejected' : 
                          newStatus === 'pending' ? 'set to pending' : 'updated';
        showToastMessage(`Vendor ${statusText} successfully!`, "success");
      } else {
        // Handle API error - extract message properly
        let errorMessage = "Failed to update vendor status";
        
        if (response && response.message) {
          errorMessage = response.message;
        } else if (response && response.error) {
          errorMessage = response.error;
        } else if (response && response.data && response.data.message) {
          errorMessage = response.data.message;
        }
        
        showToastMessage(errorMessage, "error");
      }
    } catch (error) {
      console.error("Error updating vendor status:", error);
      
      // Extract error message from different possible error structures
      let errorMessage = "An error occurred while updating vendor status";
      
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToastMessage(errorMessage, "error");
    } finally {
      // Remove vendor from updating set
      setUpdatingVendors(prev => {
        const newSet = new Set(prev);
        newSet.delete(vendorId);
        return newSet;
      });
    }
  };

  // Get status badge component
  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { icon: FaCheck, color: "#28a745", bgColor: "#d4edda", text: "Approved" },
      rejected: { icon: FaTimes, color: "#dc3545", bgColor: "#f8d7da", text: "Rejected" },
      pending: { icon: FaClock, color: "#ffc107", bgColor: "#fff3cd", text: "Pending" }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <div 
        className="status-badge"
        style={{
          backgroundColor: config.bgColor,
          color: config.color,
          padding: "4px 8px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }}
      >
        <IconComponent size={12} />
        {config.text}
      </div>
    );
  };

  // Custom dropdown toggle
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
      className="status-dropdown-toggle"
      style={{
        background: "none",
        border: "none",
        padding: "4px",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer"
      }}
    >
      <FaEllipsisV size={14} color="#6c757d" />
    </button>
  ));

  // Filter vendors based on the search query
  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.businessname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.businesslocation.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentVendors = filteredVendors.slice(
    indexOfFirstVendor,
    indexOfLastVendor
  );
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="Products">
      <p className="Product-heading">Manage Vendors</p>
      <Row>
        <Col md={8}>
          <Form className="d-flex position-relative product-search-container">
            <CiSearch
              size={20}
              className="position-absolute text-muted search-icon"
            />
            <FormControl
              type="search"
              placeholder="Search"
              className="product-search-input"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>
        </Col>

        <Col md={3}>
          <button
            onClick={handleaddNavigation}
            className="w-100 add-product-button"
          >
            Add Vendors <span className="ms-3">+</span>
          </button>
        </Col>
      </Row>

      <Row className="mt-4">
        {currentVendors.length > 0 ? (
          currentVendors.map((vendor) => (
            <Col md={3} key={vendor.id} className="mb-4">
              <Card className="vendor-card">
                <div className="vendor-card-img-container">
                  <Card.Img
                    variant="top"
                    src={`${BASE_URL}/uploads/${vendor.images[0]}`}
                    className="vendor-img"
                  />
                  <div className="image-overlay"></div>
                  <div className="vendor-info">
                    <span className="shop-name">{vendor.businessname}</span>
                    <div className="rating">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <AiFillStar color="gold" />
                        <span style={{ marginLeft: "5px" }}>
                          {vendor.ratingsAverage.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Card.Body className="p-0 m-0">
                  {/* Status and Actions Row */}
                  <Row className="vendor-status-row mt-3">
                    <Col xs={8} className="d-flex align-items-center">
                      {getStatusBadge(vendor.status)}
                    </Col>
                    <Col xs={4} className="d-flex justify-content-end">
                      <Dropdown align="end">
                        <Dropdown.Toggle as={CustomToggle} />
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigation(vendor._id);
                            }}
                          >
                            View Profile
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(vendor._id, 'approved');
                            }}
                            disabled={updatingVendors.has(vendor._id) || vendor.status === 'approved'}
                          >
                            {updatingVendors.has(vendor._id) ? 'Updating...' : 'Approve'}
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(vendor._id, 'rejected');
                            }}
                            disabled={updatingVendors.has(vendor._id) || vendor.status === 'rejected'}
                          >
                            {updatingVendors.has(vendor._id) ? 'Updating...' : 'Reject'}
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(vendor._id, 'pending');
                            }}
                            disabled={updatingVendors.has(vendor._id) || vendor.status === 'pending'}
                          >
                            {updatingVendors.has(vendor._id) ? 'Updating...' : 'Set Pending'}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Row>

                  <Row className="vendor-info-row mt-3">
                    <Col xs={6} className="d-flex align-items-center">
                      <FaMapMarkerAlt className="vendor-icon vendor-description" />
                      <span className="vendor-location vendor-description">
                        {vendor.businesslocation}
                      </span>
                    </Col>
                    <Col
                      xs={6}
                      className="d-flex align-items-center justify-content-end"
                    >
                      <MdBusiness className="vendor-icon vendor-description" />
                      <span className="vendor-type vendor-description">
                        {vendor.storetype}
                      </span>
                    </Col>
                  </Row>
                  <Card.Text className="vendor-description mt-3">
                    {vendor.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center mt-4">
            <div className="no-vendors-container">
              <AiOutlineShopping size={50} color="#ccc" />
              <p
                className="no-vendors-message mt-3"
                style={{ fontSize: "18px", color: "#555", fontWeight: "600" }}
              >
                No vendors found
              </p>
              <p
                className="no-vendors-subtext"
                style={{ fontSize: "14px", color: "#888" }}
              >
                Try adjusting your search or adding a new vendor.
              </p>
            </div>
          </Col>
        )}
      </Row>

      {loading && (
        <div className="spinner-overlay">
          <HashLoader color="#36d7b7" size={40} />
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}

      <Row className="mt-4 pagination-row">
        <Pagination
          className="pagination"
          count={Math.ceil(filteredVendors.length / vendorsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
        />
      </Row>

      {/* Toast Notifications */}
      <ToastContainer 
        position="top-end" 
        className="p-3"
        style={{ position: 'fixed', zIndex: 9999 }}
      >
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)}
          bg={toastType === 'success' ? 'success' : toastType === 'error' ? 'danger' : 'warning'}
          delay={4000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastType === 'success' ? 'Success' : toastType === 'error' ? 'Error' : 'Warning'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default Managevendors;