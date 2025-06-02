import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image, Nav } from "react-bootstrap";
import "./userprofile.css";
import UserOrder from "../Components/UserOrder";
import UserWishlist from "../Components/UserWishlist";
import UserCart from "../Components/UserCart";
import UserActivity from "../Components/UserActivity";
import UserOverview from "../Components/UserOverview";
import { useParams } from "react-router-dom";
import { getUserByID } from "../services/allApi";

function UserProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState("");

  const { id } = useParams();
  useEffect(() => {
    const fetchSingleUser = async () => {
      try {
        const response = await getUserByID(id);
        console.log(response);

        if (response && response.data) {
          const product = response.data;
          setUser({
            user: product.user,
            orders: product.orders,
            wishlist: product.wishlist,
            cart: product.cart,
            activity: product.activity,
            totalOrders: product.totalOrders,
          });
        } else {
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    if (id) {
      fetchSingleUser();
    }
  }, [id]);

  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Premium Customer",
    joinDate: "Jan 15, 2023",
    totalOrders: 24,
    profileImage: "https://via.placeholder.com/150",
    status: "Active",
  };

  // Function to render the appropriate content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <UserOverview user={user} />;
      case "orders":
        return <UserOrder orders={user.orders} />;
      case "wishlist":
        return <UserWishlist wishlist={user.wishlist} />;
      case "cart":
        return <UserCart cart={user.cart} />;
      case "activity":
        return <UserActivity activity={user.activity} />;
      default:
        return <UserOverview user={user} />;
    }
  };

  return (
    <Container fluid className="user-profile-container">
      {/* User Details Card */}
      <Row className="mb-4">
        <Col>
          <Card className="user-details-card">
            <Card.Body>
              <Row>
                <Col md={2} className="text-center">
                  <div className="profile-image-container">
                    <Image
                      src={userData.profileImage}
                      roundedCircle
                      className="profile-image"
                    />
                    <div className="status-indicator"></div>
                  </div>
                </Col>
                <Col md={5}>
                  <h2 className="user-name">{user?.user?.name}</h2>
                  <p className="user-email">{user?.user?.email}</p>
                  <div className="user-meta">
                    <span className="user-role">{user?.user?.role}</span>
                    <span className="meta-divider">|</span>
                    <span className="user-join-date">
                      Member since{" "}
                      {new Date(user?.user?.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </Col>
                <Col md={5}>
                  <div className="user-stats">
                    <h4>Account Overview</h4>
                    <div className="stat-item">
                      <span className="stat-label">Orders</span>
                      <span className="stat-value">{user?.totalOrders}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Status</span>
                      <span className="user-status">
                        {user?.user?.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </Col>
                {/* <Col
                  md={2}
                  className="d-flex align-items-center justify-content-end"
                >
                  <Button variant="primary" className="edit-profile-btn">
                    Edit Profile
                  </Button>
                </Col> */}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Navigation Tabs */}
      <Row className="mb-4">
        <Col>
          <Nav className="profile-nav-tabs">
            <Nav.Item>
              <Nav.Link
                className={activeTab === "overview" ? "active" : ""}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={activeTab === "orders" ? "active" : ""}
                onClick={() => setActiveTab("orders")}
              >
                Orders
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={activeTab === "wishlist" ? "active" : ""}
                onClick={() => setActiveTab("wishlist")}
              >
                Wishlist
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={activeTab === "cart" ? "active" : ""}
                onClick={() => setActiveTab("cart")}
              >
                Cart
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={activeTab === "activity" ? "active" : ""}
                onClick={() => setActiveTab("activity")}
              >
                Activity
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      {/* Content Section */}
      <Row>
        <Col>
          <Card className="content-card">
            <Card.Body>{renderContent()}</Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserProfile;
