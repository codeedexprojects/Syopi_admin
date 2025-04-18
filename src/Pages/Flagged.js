import React from 'react';
import flaggedimg from '../images/syopi-admin-product.jpeg';
import './flagged.css';
import { Col, Row } from 'react-bootstrap';
import { Rating } from '@mui/material';
import report from '../images/report.png'
function Flagged() {
  return (
    <div className="Flagged-product">
      <p className="flagged-title">Product Flagged</p>
      <Row>
        <Col md={4}>
          <div>
            <img src={flaggedimg} alt="Product" className="flagged-img" />
          </div>
        </Col>
        <Col md={8}>
          <div className="flagged-right-col">
            <p className="flagged-product-title">Churidar</p>
            <div className="rating-section">
              <Rating name="size-large" defaultValue={2} size="medium" />
              <span className="rating-text">440+ Reviewer</span>
            </div>
            <p className="flagged-product-description">
              It is a long established fact that a reader will be distracted by the readable content.
            </p>
            <div className="flagged-details">
              <Row className="align-items-center g-0 container w-75">
                <Col xs={6}>
                  <Row className="align-items-center g-0">
                    <Col xs={6} className="flagged-detail-label">Category</Col>
                    <Col xs={6} className="flagged-detail-value">Women</Col>
                  </Row>
                  <Row className="align-items-center g-0">
                    <Col xs={6} className="flagged-detail-label">Sub Category</Col>
                    <Col xs={6} className="flagged-detail-value">Top</Col>
                  </Row>
                </Col>
                <Col xs={6}>
                  <Row className="align-items-center g-0">
                    <Col xs={6} className="flagged-detail-label">Brand</Col>
                    <Col xs={6} className="flagged-detail-value">Siyopi</Col>
                  </Row>
                  <Row className="align-items-center g-0">
                    <Col xs={6} className="flagged-detail-label">Color</Col>
                    <Col xs={6} className="flagged-detail-value">Blue</Col>
                  </Row>
                 
                </Col>
              </Row>
               <Row >
                    <p className='flagged-price'>$80.00/<span> h</span></p>
                    <p className='flagged-price2'>$100.00</p>
      

                  </Row>
            </div>
          </div>
        </Col>
      </Row>
      <Row className='f-report-row m-5 mt-4'>
        <p className='f-report-title'> Reported</p>
        <p className='f-report-sub-title'> Product Name</p>

        <Row className="report-row">
  {Array(3)
    .fill()
    .map((_, index) => (
      <Col key={index} className="report-card">
        <p className="f-report-title">Problem</p>
        <p className="f-report-sub-title">Description</p>
        <Row>
          <Col xs={3}>
            <img src={report} alt="report" className="report-image" />
          </Col>
          <Col>
            <p className="f-report-reviewer-name">Reviewer Name</p>
            <p className="f-report-reviewer-date">Date</p>
          </Col>
        </Row>
      </Col>
    ))}
</Row>


      </Row>
    </div>
  );
}

export default Flagged;
