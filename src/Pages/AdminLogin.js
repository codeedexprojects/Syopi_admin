import React, { useState } from "react";
import "./adminlogin.css";
import { Col, Row, Container, Form } from "react-bootstrap";
import loginimg from "../images/admin-login.png";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { PiGreaterThanBold } from "react-icons/pi";
import { adminLoginApi } from "../services/allApi";
import { toast, ToastContainer } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await adminLoginApi({ email, password });
  
  
      setLoading(false);
  
      // Check for response success and save appropriate IDs and roles
      if (response && response.success && response.data) {
        localStorage.setItem("accessToken", response.data.accessToken);                
        localStorage.setItem("refreshToken", response.data.refreshToken);
  
        // Save the role
        localStorage.setItem("role", "admin");
  
        // Save admin ID
        localStorage.setItem("adminId", response.data.admin.id);
        localStorage.removeItem("vendorId");
  
        // Navigate to admin dashboard
        navigate("/admindashboard", { replace: true });
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
            <p className="admin-login-p1">Hello Admin!</p>
            <p className="admin-login-p2">Welcome Back</p>

           

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
  <div className="login-input-group position-relative">
    <FaLock className="input-icon" />
    <Form.Control
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      className="custom-input"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <span
      className="password-toggle-icon"
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#888",
      }}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
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