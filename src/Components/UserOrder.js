import React, { useState } from 'react';
import { Table,  Container, Card, Form,  Row, Col } from 'react-bootstrap';
import { Search } from 'lucide-react';
import './userorder.css';

function UserOrder({orders}) {
  const [searchTerm, setSearchTerm] = useState('');
  console.log("orders",orders);
  
 

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <span className="status-badge delivered">Delivered</span>;
      case 'processing':
        return <span className="status-badge processing">Processing</span>;
      case 'shipped':
        return <span className="status-badge shipped">Shipped</span>;
      case 'pending':
        return <span className="status-badge pending">Pending</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(order => 
    order.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="user-order-container">
      <Row className="justify-content-center">
        <Col xs={12} className="order-wrapper">
          <Card className="order-card">
            <Card.Header className="order-header">
              <div className="header-content">
                <h3>Orders</h3>
                <div className="search-wrapper">
                  <div className="search-container">
                    <Search className="search-icon" size={16} />
                    <Form.Control
                      className="search-input"
                      placeholder="Search orders..."
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
                      <th>Order Date</th>
                      <th>Customer ID</th>
                      <th>Status</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order,index) => (
                      <tr key={order}>
                        <td>{index+1}</td>
                        <td className="product-cell">{order.color}</td>
                        <td>{order.createdAt}</td>
                        <td>{order.color}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td className="price-cell">{order.itemTotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
            <Card.Footer className="order-footer">
              <span>Showing {filteredOrders.length} of {orders.length} orders</span>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserOrder;