import React, { useState } from 'react';
import { Table,  Container, Card, Form,  Row, Col } from 'react-bootstrap';
import { Search } from 'lucide-react';
import './userorder.css';

function UserOrder() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data - replace with your actual data
  const orders = [
    { id: 1, product: 'Premium Headphones', orderDate: '2025-05-10', customerId: 'CUST-1243', status: 'Delivered', price: '₹249.99' },
    { id: 2, product: 'Wireless Keyboard', orderDate: '2025-05-09', customerId: 'CUST-8754', status: 'Processing', price: '₹89.99' },
    { id: 3, product: 'UHD Monitor', orderDate: '2025-05-08', customerId: 'CUST-3452', status: 'Shipped', price: '₹399.99' },
    { id: 4, product: 'Ergonomic Chair', orderDate: '2025-05-07', customerId: 'CUST-9023', status: 'Pending', price: '₹299.99' },
    { id: 5, product: 'USB-C Hub', orderDate: '2025-05-06', customerId: 'CUST-6234', status: 'Delivered', price: '₹59.99' },
  ];

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
    order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerId.toLowerCase().includes(searchTerm.toLowerCase())
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
                    {filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td className="product-cell">{order.product}</td>
                        <td>{order.orderDate}</td>
                        <td>{order.customerId}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td className="price-cell">{order.price}</td>
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