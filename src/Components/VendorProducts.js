import React, { useState } from "react";
import "./vendorproduct.css";
import { Table, Container, Card, Form, Row, Col } from "react-bootstrap";
import { Search } from "lucide-react";

function VendorProducts({ product }) {
  // Move useState to the top level of the component
  const [searchTerm, setSearchTerm] = useState("");

  // Null check for product
  if (!product || !Array.isArray(product) || product.length === 0) {
    return (
      <Container fluid className="user-order-container">
        <Row className="justify-content-center">
          <Col xs={12} className="order-wrapper">
            <Card className="order-card">
              <Card.Body className="p-4 text-center">
                <h4>No products available</h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  const filteredProducts = product.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A";
    return date.toLocaleDateString();
  };

  // Function to get status class for styling
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "status-active";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  return (
    <div>
      <Container fluid className="user-order-container">
        <Row className="justify-content-center">
          <Col xs={12} className="order-wrapper">
            <Card className="order-card">
              <Card.Header className="order-header">
                <div className="header-content">
                  <h3>Products</h3>
                  <div className="search-wrapper">
                    <div className="search-container">
                      <Search className="search-icon" size={16} />
                      <Form.Control
                        className="search-input"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="order-table">
                    <thead>
                      <tr>
                        <th>SI No</th>
                        <th>Product</th>
                        <th>Type</th>
                        <th>Product Code</th>
                        <th>Status</th>
                        <th>Created Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((item, index) => (
                        <tr key={item._id || index}>
                          <td>{index + 1}</td>
                          <td className="product-cell">{item.name || "N/A"}</td>
                          <td>{item.productType || "N/A"}</td>
                          <td>{item.productCode || "N/A"}</td>
                          <td>
                            <span className={`status-badge ${getStatusClass(item.status)}`}>
                              {item.status || "N/A"}
                            </span>
                          </td>
                          <td>{formatDate(item.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
              <Card.Footer className="order-footer">
                <span>
                  Showing {filteredProducts.length} of {product.length} products
                </span>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default VendorProducts;