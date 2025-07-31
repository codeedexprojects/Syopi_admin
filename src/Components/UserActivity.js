import React from 'react';
import { Card, Table, Badge, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserActivity.css';

function UserActivity({ activity }) {
  
  // If no activity data is available
  if (!activity || activity.length === 0) {
    return (
      <Card className="user-activity-card">
        <Card.Header as="h5">User Activity</Card.Header>
        <Card.Body>
          <div className="no-activity">No activity records found</div>
        </Card.Body>
      </Card>
    );
  }

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function to render rating stars
  const renderRating = (rating) => {
    return (
      <div className="rating">
        {[...Array(5)].map((_, index) => (
          <span 
            key={index} 
            className={`star ${index < rating ? 'filled' : 'empty'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <Card className="user-activity-card">
      <Card.Header as="h5">User Activity</Card.Header>
      <Card.Body>
        <Table responsive hover className="activity-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Product ID</th>
              <th>Rating</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((item) => (
              <tr key={item._id}>
                <td className="user-id">{item.userId}</td>
                <td className="product-id">{item.productId}</td>
                <td>{renderRating(item.rating)}</td>
                <td className="message-cell">{item.message}</td>
                <td>{formatDate(item.createdAt)}</td>
                <td>
                  <Badge bg="success" className="activity-badge">Active</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        
        <Row className="activity-summary">
          <Col md={6}>
            <div className="summary-card">
              <h6>Total Activities</h6>
              <div className="summary-value">{activity.length}</div>
            </div>
          </Col>
          <Col md={6}>
            <div className="summary-card">
              <h6>Average Rating</h6>
              <div className="summary-value">
                {(activity.reduce((sum, item) => sum + item.rating, 0) / activity.length).toFixed(1)}
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default UserActivity;