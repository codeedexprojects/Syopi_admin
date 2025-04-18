import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FaClipboardList, FaTshirt } from 'react-icons/fa';
import { MdRemoveShoppingCart } from 'react-icons/md';
import { IoMdCart } from 'react-icons/io';
import '../../Pages/Home.css';
import { PiGreaterThanBold } from 'react-icons/pi';
import Storevisitors from '../../Components/Storevisitors';
import OrderStatistics from '../../Components/OrderStatistics';
import Leaderboard from '../../Components/Leaderboard';
import RecTransaction from '../../Components/RecTransaction';
import Dproducts from '../../Components/Dproducts'
import OrderGraph from '../../Components/OrderGraph'
import Dorders from '../../Components/Dorders'
import Weekly from '../../Components/Weekly'


function VendorDashboard() {
  const cardsData = [
    { title: 'All Product', count: 120, icon: <FaTshirt style={{ color: '#495DD9' }} />, color: '#495DD9' },
    { title: 'Current Orders', count: 45, icon: <FaClipboardList style={{ color: '#66BB6A' }} />, color: '#66BB6A' },
    { title: 'Out of Stock', count: 15, icon: <MdRemoveShoppingCart style={{ color: '#FB544B' }} />, color: '#FB544B' },
    { title: 'Limited Stock', count: 8, icon: <IoMdCart style={{ color: '#FFA425' }} />, color: '#FFA425' },
  ];

  return (
    <div className="p-4 dashboard-container">
      <Row>
        {cardsData.map((card, index) => (
          <Col key={index} md={3} sm={6} className="mb-4">
            <Card className="dashboard-card shadow">
              <Card.Body>
                <div className="dashboard-card-header">
                  <Card.Title className="mb-4 dashboard-card-title">{card.title}</Card.Title>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="dashboard-card-number">{card.count}</h2>
                  <div className="dashboard-card-icon">{card.icon}</div>
                </div>
                <div className="dashboard-card-footer">
                  <Button variant="link" className="view-btn p-0 dashboard-card-view">
                    View <span className="arrow-icon mt-1 ms-2"><PiGreaterThanBold /></span>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mt-5">
        <Col md={7}>
          <OrderGraph />
        </Col>
        <Col md={5}>
          <Storevisitors />
        </Col>
      </Row>
      <Row className="mt-5" >
        <Col md={6}>
          <Dproducts />
        </Col>
        <Col md={6}>
          <Dorders />
        </Col>
      </Row>
      <Row className="mt-5" >
        <Col md={7}>
          <Weekly />
        </Col>
        <Col md={5}>
        <OrderStatistics></OrderStatistics>
        </Col>
        
      </Row>
      <Row className="mt-5" >
        <Col md={12}>
          <Leaderboard />
        </Col>
        
      </Row>
      <Row className="mt-5" >
        <Col md={12}>
          <RecTransaction />
        </Col>
        
      </Row>
    </div>
  );
}

export default VendorDashboard;
