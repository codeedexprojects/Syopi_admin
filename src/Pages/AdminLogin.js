import React, { useState } from "react";
import "./adminlogin.css";
import { Col, Row, Container, Form } from "react-bootstrap";
import loginimg from "../images/admin-login.png";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { PiGreaterThanBold } from "react-icons/pi";
import { adminLoginApi, venodorLoginApi } from "../services/allApi";
import { toast, ToastContainer } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(true); // Toggle between Admin and Vendor

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
  
    setLoading(true);
  
    try {
      const apiCall = isAdminLogin ? adminLoginApi : venodorLoginApi;
      const response = await apiCall({ email, password });
  
      console.log("Response:", response); // Debugging the full response object
  
      setLoading(false);
  
      // Check for response success and save appropriate IDs and roles
      if (response && response.success && response.data) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
  
        // Save the role
        const role = isAdminLogin ? "admin" : "vendor";
        localStorage.setItem("role", role);
  
        if (isAdminLogin) {
          // Save admin ID
          localStorage.setItem("adminId", response.data.admin.id);
          localStorage.removeItem("vendorId")
        } else {
          // Save vendor ID
          localStorage.setItem("vendorId", response.data.vendorId);
          localStorage.removeItem("adminId")

        }
  
        // Navigate to the appropriate page based on role
        if (role === "admin") {
          window.location.href = "/"; // Admin dashboard
        } else if (role === "vendor") {
          window.location.href = "/vendordashboard"; // Vendor dashboard
        }
      } else {
        // Handle case when response.success is false or data is missing
        const errorMessage = response?.error?.message || "Login failed. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
      setLoading(false);
  
      // Log the error for debugging purposes
      console.error("Error during login:", error);
  
      // Display a generic error message
      toast.error("An error occurred. Please try again.");
    }
  };
  
  

  return (
    <div className="admin-login">
      <Container fluid>
        <Row className="w-100">
          <Col md={7} className="admin-login-left-col">
            <div className="img-container-login">
              <div className="angled-rect-container">
                <div className="angled-rect angled-rect-1"></div>
                <div className="angled-rect angled-rect-2"></div>
                <div className="angled-rect angled-rect-3"></div>
              </div>
              <div className="circle-container">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
                <div className="circle circle-3"></div>
              </div>
              <img src={loginimg} alt="Login" className="login-img-left" />
              <img src={loginimg} alt="Login" className="login-img" />
              <div className="admin-login-img-back">
                <PiGreaterThanBold className="admin-login-img-back-icon" />
                <PiGreaterThanBold className="admin-login-img-back-icon" />
              </div>
            </div>
          </Col>

          <Col md={5} className="admin-login-right-col">
            <p className="admin-login-logo">Syopi</p>
            <p className="admin-login-p1">Hello Again!</p>
            <p className="admin-login-p2">Welcome Back</p>

            {/* Toggle between Admin and Vendor */}
            <div className="login-toggle-container">
  <button
    className={`login-toggle-button ${isAdminLogin ? "login-toggle-active" : ""}`}
    onClick={() => setIsAdminLogin(true)}
  >
    <i className="fas fa-user-shield"></i> {/* Admin Icon */}
    Admin Login
  </button>
  <button
    className={`login-toggle-button ${!isAdminLogin ? "login-toggle-active" : ""}`}
    onClick={() => setIsAdminLogin(false)}
  >
    <i className="fas fa-user-tie"></i> {/* Vendor Icon */}
    Vendor Login
  </button>
</div>


            <Form className="login-form" onSubmit={handleLogin}>
              <Form.Group controlId="formEmail">
                <div className="login-input-group">
                  <FaEnvelope className="input-icon" />
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    className="custom-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="formPassword" className="mt-3">
                <div className="login-input-group">
                  <FaLock className="input-icon" />
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    className="custom-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </Form.Group>

              <div className="button-container">
                <button
                  className="admin-login-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>

              {loading && (
                <div className="spinner-overlay">
                  <HashLoader color="#36d7b7" size={60} />
                </div>
              )}
            </Form>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default AdminLogin;
