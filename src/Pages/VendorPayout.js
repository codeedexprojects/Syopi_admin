import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Table, 
  Button, 
  Badge, 
  Spinner, 
  Modal, 
  Alert,
  Toast,
  ToastContainer,
  Card
} from 'react-bootstrap';
import './vendorpayout.css';
import { getAllVendorPayoutsApi, updateVendorPayoutStatusApi } from '../services/allApi';

function VendorPayout() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPayout, setCurrentPayout] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updateMessage, setUpdateMessage] = useState({ type: '', message: '' });
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  // Fetch all vendor payouts on component mount
  useEffect(() => {
    fetchVendorPayouts();
  }, []);

  const fetchVendorPayouts = async () => {
    setLoading(true);
    try {
      const response = await getAllVendorPayoutsApi();
      console.log("payouts", response);
      
      if (response.success) {
        setPayouts(response.data.payouts);
        setError(null);
      } else {
        setError(response.error || 'Failed to load payouts');
      }
    } catch (err) {
      setError('An error occurred while fetching payouts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (payout) => {
    setCurrentPayout(payout);
    setNewStatus(payout.status === 'Pending' ? 'Paid' : 'Pending');
    setShowModal(true);
    // Reset any previous update messages
    setUpdateMessage({ type: '', message: '' });
  };

  const handleUpdateStatus = async () => {
    try {
      const statusData = {
        payoutId: currentPayout._id,
        status: newStatus
      };

      const response = await updateVendorPayoutStatusApi(statusData);
      
      if (response.success) {
        // Update the local state to reflect the change
        const updatedPayouts = payouts.map(payout => 
          payout._id === currentPayout._id 
            ? { ...payout, status: newStatus } 
            : payout
        );
        setPayouts(updatedPayouts);
        setUpdateMessage({ type: 'success', message: 'Payout status updated successfully!' });
        
        // Close the modal after success
        setTimeout(() => {
          setShowModal(false);
          // Show toast notification after modal closes
          setToast({ 
            show: true, 
            type: 'success',
            message: `Payout for ${currentPayout.vendorId?.name || 'vendor'} marked as ${newStatus}` 
          });
          setUpdateMessage({ type: '', message: '' });
        }, 1500);
      } else {
        setUpdateMessage({ 
          type: 'danger', 
          message: response.message || response.error || 'Failed to update status' 
        });
      }
    } catch (err) {
      console.error(err);
      // Handle specific error for invalid status
      if (err.response && err.response.data && err.response.data.message === "Invalid status") {
        setUpdateMessage({ 
          type: 'danger', 
          message: 'Invalid status. Only "Pending" or "Paid" are allowed.' 
        });
      } else {
        setUpdateMessage({ 
          type: 'danger', 
          message: 'An error occurred while updating status' 
        });
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle toast close
  const handleToastClose = () => {
    setToast({ ...toast, show: false });
  };

  if (loading) {
    return (
      <div className="vp-loader-container">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading payout data...</p>
      </div>
    );
  }

  return (
    <Container fluid className="vp-container">
      {/* Toast notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          onClose={handleToastClose} 
          show={toast.show} 
          delay={3000} 
          autohide 
          bg={toast.type}
          className="vp-toast"
        >
          <Toast.Header closeButton>
            <strong className="me-auto">Payout Update</strong>
          </Toast.Header>
          <Toast.Body className={toast.type === 'success' ? 'text-white' : ''}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="vp-header-section">
        <Row className="align-items-center mb-4">
          <Col>
            <h2 className="vp-page-title">Vendor Payouts</h2>
            <p className="vp-page-subtitle">Manage all vendor payment transactions</p>
          </Col>
        
        </Row>
      </div>

      {/* Summary Cards */}
      {!loading && !error && payouts.length > 0 && (
        <div className="vp-summary-section">
          <Row>
            <Col md={3}>
              <Card className="vp-summary-card">
                <Card.Body>
                  <h6 className="vp-summary-card-title">Total Payouts</h6>
                  <h3 className="vp-summary-card-value">{payouts.length}</h3>
                  <div className="vp-summary-card-subtitle">Vendor accounts</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="vp-summary-card">
                <Card.Body>
                  <h6 className="vp-summary-card-title">Total Sales</h6>
                  <h3 className="vp-summary-card-value">
                    {formatCurrency(payouts.reduce((total, payout) => total + payout.totalSales, 0))}
                  </h3>
                  <div className="vp-summary-card-subtitle">Combined sales volume</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="vp-summary-card">
                <Card.Body>
                  <h6 className="vp-summary-card-title">Admin Commission</h6>
                  <h3 className="vp-summary-card-value">
                    {formatCurrency(payouts.reduce((total, payout) => total + payout.adminCommission, 0))}
                  </h3>
                  <div className="vp-summary-card-subtitle">Platform revenue</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="vp-summary-card">
                <Card.Body>
                  <h6 className="vp-summary-card-title">Pending Payouts</h6>
                  <h3 className="vp-summary-card-value">
                    {formatCurrency(payouts
                      .filter(payout => payout.status === 'Pending')
                      .reduce((total, payout) => total + payout.netPayable, 0))}
                  </h3>
                  <div className="vp-summary-card-subtitle">Awaiting settlement</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="vp-alert mb-4">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}

      {payouts.length === 0 && !error ? (
        <Alert variant="info" className="vp-alert vp-empty-alert">
          <i className="fas fa-info-circle me-2"></i>
          No payout records found.
        </Alert>
      ) : (
        <div className="vp-table-container">
          <Table responsive striped hover className="vp-table">
            <thead className="vp-table-header">
              <tr>
              <th>SI No</th>
                <th>Vendor</th>
                <th>Total Sales</th>
                <th>Coupon Discounts</th>
                <th>Admin Commission</th>
                <th>Net Payable</th>
                <th>Payout Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout,index) => (
                <tr key={payout._id} className="vp-table-row">
                    <td>{index+1}</td>
                  <td>
                    <div className="vp-vendor-info">
                      <span className="vp-vendor-name">
                        {payout.vendorId?.name || 'Unknown Vendor'}
                      </span>
                      <span className="vp-vendor-email">
                        {payout.vendorId?.email || 'No email'}
                      </span>
                    </div>
                  </td>
                  <td>{formatCurrency(payout.totalSales)}</td>
                  <td>{formatCurrency(payout.totalCouponDiscounts)}</td>
                  <td>{formatCurrency(payout.adminCommission)}</td>
                  <td className="vp-net-payable">{formatCurrency(payout.netPayable)}</td>
                  <td>{formatDate(payout.payoutDate)}</td>
                  <td>
                    <Badge 
                      bg={payout.status === 'Paid' ? 'success' : 'warning'} 
                      className="vp-status-badge"
                    >
                      {payout.status}
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      variant={payout.status === 'Pending' ? 'outline-success' : 'outline-warning'}
                      size="sm"
                      className="vp-action-btn"
                      onClick={() => handleStatusChange(payout)}
                    >
                      {payout.status === 'Pending' ? 'Mark Paid' : 'Mark Pending'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Status Update Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
        className="vp-modal"
      >
        <Modal.Header closeButton className="vp-modal-header">
          <Modal.Title>Update Payout Status</Modal.Title>
        </Modal.Header>
        <Modal.Body className="vp-modal-body">
          {updateMessage.message && (
            <Alert variant={updateMessage.type} className="vp-modal-alert">
              {updateMessage.message}
            </Alert>
          )}
          
          {!updateMessage.message && currentPayout && (
            <>
              <p className="vp-modal-message">
                Are you sure you want to change the status of this payout to{' '}
                <Badge 
                  bg={newStatus === 'Paid' ? 'success' : 'warning'}
                  className="vp-modal-badge"
                >
                  {newStatus}
                </Badge> ?
              </p>
              
              <div className="vp-payout-summary">
                <div className="vp-summary-item">
                  <span className="vp-summary-label">Vendor:</span>
                  <span className="vp-summary-value">{currentPayout.vendorId?.name || 'Unknown Vendor'}</span>
                </div>
                <div className="vp-summary-item">
                  <span className="vp-summary-label">Amount:</span>
                  <span className="vp-summary-value vp-summary-amount">{formatCurrency(currentPayout.netPayable)}</span>
                </div>
                <div className="vp-summary-item">
                  <span className="vp-summary-label">Current Status:</span>
                  <Badge 
                    bg={currentPayout.status === 'Paid' ? 'success' : 'warning'}
                    className="vp-status-badge-sm"
                  >
                    {currentPayout.status}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        {!updateMessage.message && (
          <Modal.Footer className="vp-modal-footer">
            <Button 
              variant="light" 
              onClick={() => setShowModal(false)}
              className="vp-modal-btn-cancel"
            >
              Cancel
            </Button>
            <Button 
              variant={newStatus === 'Paid' ? 'success' : 'warning'} 
              onClick={handleUpdateStatus}
              className="vp-modal-btn-confirm"
            >
              Confirm
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </Container>
  );
}

export default VendorPayout;