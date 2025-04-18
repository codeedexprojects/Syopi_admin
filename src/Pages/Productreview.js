import React, { useState } from 'react';
import flaggedimg from '../images/syopi-admin-product.jpeg';
import './flagged.css';
import { Col, Row } from 'react-bootstrap';
import { Rating } from '@mui/material';
import report from '../images/report.png';
import './productreview.css';

function Productreview() {
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const reviews = [
    {
      title: "Review Title 1",
      body: "Review body 1",
      reviewer: "John Doe",
      date: "2025-01-01",
    },
    {
      title: "Review Title 2",
      body: "Review body 2",
      reviewer: "Jane Doe",
      date: "2025-01-02",
    },
    {
      title: "Review Title 3",
      body: "Review body 3",
      reviewer: "Chris Doe",
      date: "2025-01-03",
    },
  ];

  const handleReplyClick = (review) => {
    setIsReplyMode(true);
    setSelectedReview(review);
  };

  const handleSendReply = () => {
    // Add functionality to send reply here
    console.log("Reply sent!");
    setIsReplyMode(false);
    setSelectedReview(null);
  };

  return (
    <div className="Flagged-product">
      <p className="flagged-title">{isReplyMode ? "Reply Review" : "Product Review"}</p>
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
              <Row>
                <p className="flagged-price">$80.00/<span> h</span></p>
                <p className="flagged-price2">$100.00</p>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {!isReplyMode ? (
        <Row className="f-report-row m-5 mt-4">
          <p className="f-report-title">Latest Reviews</p>
          <Row className="report-row">
            {reviews.map((review, index) => (
              <Col key={index} className="report-card">
                <div className="rating-section">
                  <Rating name="size-large" defaultValue={2} size="medium" />
                </div>
                <p className="f-report-title">{review.title}</p>
                <p className="f-report-sub-title">{review.body}</p>
                <Row>
                  <Col xs={3} md={3}>
                    <img src={report} alt="report" className="report-image" />
                  </Col>
                  <Col md={6}>
                    <p className="f-report-reviewer-name">{review.reviewer}</p>
                    <p className="f-report-reviewer-date">{review.date}</p>
                  </Col>
                  <Col md={3} className="text-end align-self-center">
                    <button
                      className="reply-link btn btn-link"
                      onClick={() => handleReplyClick(review)}
                    >
                      Reply
                    </button>
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
        </Row>
      ) : (
        <Row className="f-report-row m-5 mt-4">
          <p className="f-report-title">Reply review</p>
        <Row className="reply-section">
          <Col md={12}>
            <div >
          <Row>
                <Col>
                    <div className="rating-section">
                          <Rating name="size-large" defaultValue={2} size="medium" />
                        </div>
                      <p className="f-report-title">{selectedReview?.title}</p>
                      <p className="f-report-sub-title">{selectedReview?.body}</p>
                </Col>
               <Col className="text-end">
  <Row className="align-items-center g-0">
    {/* Image Column */}
    <Col xs={3} md={9} className="p-0 d-flex justify-content-end">
      <img src={report} alt="report" className="review-image" />
    </Col>

    {/* Text Column */}
    <Col className="p-0 me-4 text-start">
    <p className="f-report-reviewer-name mb-0">{selectedReview?.reviewer}</p>
    <p className="f-report-reviewer-date mb-0">{selectedReview?.date}</p>
    </Col>
  </Row>
</Col>


          </Row>
            </div>
            <textarea
              className="reply-textarea"
              placeholder="Write your reply here..."
            ></textarea>
            <button
              className="review-button mt-3"
              onClick={handleSendReply}
            >
              Send Reply
            </button>
          </Col>
        </Row>
        </Row>
      )}
    </div>
  );
}

export default Productreview;
