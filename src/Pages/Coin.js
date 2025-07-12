import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getCoinSettingsApi, updateCoinSettingsApi } from '../services/allApi';
import './coin.css';

function Coin() {
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [settings, setSettings] = useState({
    percentage: 0,
    minAmount: 0,
    referralCoins: 50
  });
  const [formValues, setFormValues] = useState({
    percentage: 0,
    minAmount: 0,
    referralCoins: 50
  });

  // Fetch current coin settings on component mount
  useEffect(() => {
    fetchCoinSettings();
  }, []);

  const fetchCoinSettings = async () => {
    setLoading(true);
    try {
      const response = await getCoinSettingsApi();
      console.log('API Response:', response);
      
      if (response && response.data) {
        setSettings(response.data);
        setFormValues(response.data);
      } else if (response) {
        // Handle case where response doesn't have data property
        setSettings(response);
        setFormValues(response);
      }
    } catch (error) {
      toast.error('Failed to load coin settings');
      console.error('Error fetching coin settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value === '' ? '' : parseFloat(value) || 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const response = await updateCoinSettingsApi(formValues);
      console.log('Update Response:', response);
      
      if (response) {
        // Handle different possible response structures
        if (response.settings) {
          setSettings(response.settings);
        } else if (response.data) {
          setSettings(response.data);
        } else {
          setSettings(response);
        }
        toast.success('Coin settings updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update coin settings');
      console.error('Error updating coin settings:', error);
    } finally {
      setUpdating(false);
    }
  };

  const resetForm = () => {
    setFormValues(settings);
    toast.info('Form reset to current settings');
  };

  return (
    <Container className="coin-settings-container py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Row className="mb-4">
        <Col>
          <h2 className="section-title">Coin Settings Management</h2>
          <p className="section-description">
            Configure coin earning rate, minimum transaction amount, and referral rewards
          </p>
        </Col>
      </Row>

      <Row>
        <Col lg={6} className="mb-4">
          <Card className="current-settings-card">
            <Card.Header className="bg-dark text-white">
              <h4 className="mb-0">Current Settings</h4>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading settings...</p>
                </div>
              ) : (
                <div className="settings-summary">
                  <div className="setting-item">
                    <div className="setting-label">Cashback Percentage:</div>
                    <div className="setting-value">{settings.percentage || 0}%</div>
                  </div>
                  <div className="setting-item">
                    <div className="setting-label">Minimum Transaction Amount:</div>
                    <div className="setting-value">₹{settings.minAmount || 0}</div>
                  </div>
                  <div className="setting-item">
                    <div className="setting-label">Referral Reward:</div>
                    <div className="setting-value">{settings.referralCoins || 50} coins</div>
                  </div>
                  <div className="setting-item">
                    <div className="setting-label">Last Updated:</div>
                    <div className="setting-value">
                      {settings.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'Not available'}
                    </div>
                  </div>
                </div>
              )}
              <Button 
                variant="outline-dark" 
                className="mt-3 w-100"
                onClick={fetchCoinSettings}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh Settings'}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="update-settings-card">
            <Card.Header className="bg-dark text-white">
              <h4 className="mb-0">Update Settings</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Cashback Percentage (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="percentage"
                    value={formValues.percentage || 0}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    required
                  />
                  <Form.Text className="text-muted">
                    Percentage of transaction amount converted to coins
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Minimum Transaction Amount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="minAmount"
                    value={formValues.minAmount === 0 ? '' : formValues.minAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="Enter minimum amount"
                    required
                  />
                  <Form.Text className="text-muted">
                    Minimum purchase amount to earn coins
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Referral Reward (coins)</Form.Label>
                  <Form.Control
                    type="number"
                    name="referralCoins"
                    value={formValues.referralCoins === 0 ? '' : formValues.referralCoins}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    placeholder="Enter referral coins"
                    required
                  />
                  <Form.Text className="text-muted">
                    Number of coins awarded for successful referrals
                  </Form.Text>
                </Form.Group>

                <div className="d-flex justify-content-between mt-4">
                  <Button 
                    variant="secondary" 
                    type="button" 
                    onClick={resetForm}
                    disabled={updating}
                  >
                    Reset
                  </Button>
                  <Button 
                    variant="dark" 
                    type="submit"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Coin;