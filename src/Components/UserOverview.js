import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import './useroverview.css';

const UserOverview = ({ user }) => {
  if (!user) {
    return <div className="text-center py-4">Loading user data...</div>;
  }

  // Format date to a readable string
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="user-overview">
      <h3 className="section-title">Account Overview</h3>
      
      <Row className="mb-4">
        <Col md={6}>
          <Card className="overview-card">
            <Card.Header className="card-header-custom">
              <h5>Personal Information</h5>
            </Card.Header>
            <Card.Body className="card-body-custom">
              <div className="field-item">
                <span className="field-label">Name:</span>
                <span className="field-value">{user.user?.name || "Not available"}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Email:</span>
                <span className="field-value">{user.user?.email || "Not available"}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Phone:</span>
                <span className="field-value">{user.user?.phone || "Not available"}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Gender:</span>
                <span className="field-value">{user.user?.gender || "Not available"}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Member Since:</span>
                <span className="field-value">
                  {user.user?.createdAt ? formatDate(user.user.createdAt) : "Not available"}
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="overview-card">
            <Card.Header className="card-header-custom">
              <h5>Account Statistics</h5>
            </Card.Header>
            <Card.Body className="card-body-custom">
              <div className="field-item">
                <span className="field-label">Account Status:</span>
                <span className="field-value">
                  <span className={`status-badge ${user.user?.isActive ? "status-active" : "status-inactive"}`}>
                    {user.user?.isActive ? "Active" : "Inactive"}
                  </span>
                </span>
              </div>
              <div className="field-item">
                <span className="field-label">Role:</span>
                <span className="field-value">
                  {user.user?.role ? user.user.role.charAt(0).toUpperCase() + user.user.role.slice(1) : "Not available"}
                </span>
              </div>
              <div className="field-item">
                <span className="field-label">Total Orders:</span>
                <span className="field-value">{user.totalOrders || 0}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Items in Wishlist:</span>
                <span className="field-value">{user.wishlist?.length || 0}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Referral Code:</span>
                <span className="field-value">{user.user?.referralCode || "Not available"}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
        <Card className="overview-card">
  <Card.Header className="card-header-custom">
    <h5>Recent Activity</h5>
  </Card.Header>
  <Card.Body className="card-body-custom">
    {user.activity && user.activity.length > 0 ? (
      <div className="activity-timeline">
        {user.activity.map((item, index) => (
          <div key={index} className="activity-item mb-3">
            <div className="d-flex justify-content-between">
              <div className="activity-title">Rated a product</div>
              <div className="activity-date">{formatDate(item.createdAt)}</div>
            </div>
            <div className="activity-description">
              <strong>Rating:</strong> {item.rating} / 5
            </div>
            <div className="activity-description">
              <strong>Comment:</strong> {item.message}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="empty-state">No recent activity found</div>
    )}
  </Card.Body>
</Card>

        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col md={6}>
          <Card className="overview-card">
            <Card.Header className="card-header-custom">
              <h5>Order Summary</h5>
            </Card.Header>
            <Card.Body className="card-body-custom">
              {user.orders && user.orders.length > 0 ? (
                <div>
                  <div className="field-item">
                    <span className="field-label">Total Orders:</span>
                    <span className="field-value">{user.totalOrders || user.orders.length}</span>
                  </div>
                  <div className="field-item">
                    <span className="field-label">Recent Order:</span>
                    <span className="field-value">
                      {user.orders[0]?._id ? `Order #${user.orders[0]._id.slice(-6)}` : "None"}
                    </span>
                  </div>
                  <div className="field-item">
                    <span className="field-label">Last Order Date:</span>
                    <span className="field-value">
                      {user.orders[0]?.createdAt ? formatDate(user.orders[0].createdAt) : "None"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="empty-state">No order history available</div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="overview-card">
            <Card.Header className="card-header-custom">
              <h5>Cart Summary</h5>
            </Card.Header>
            <Card.Body className="card-body-custom">
              {user.cart ? (
                <div>
                  <div className="field-item">
                    <span className="field-label">Subtotal:</span>
                    <span className="field-value">Rs.{user.cart.subtotal || 0}</span>
                  </div>
                  <div className="field-item">
                    <span className="field-label">Items in Cart:</span>
                    <span className="field-value">{user.cart.items?.length || 0}</span>
                  </div>
                  <div className="field-item">
                    <span className="field-label">Last Updated:</span>
                    <span className="field-value">
                      {user.cart.updatedAt ? formatDate(user.cart.updatedAt) : "Not available"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="empty-state">Cart is empty</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserOverview;