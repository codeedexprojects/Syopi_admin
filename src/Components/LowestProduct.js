import React, { useState, useEffect } from 'react';
import {  Button, Form, Modal, Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import './LowestProduct.css';
import {getLowestPriceProductApi, createLowestPriceProductApi, deleteLowestPriceProductApi, updateLowestPriceProductApi } from '../services/allApi';
import { BASE_URL } from '../services/baseUrl';

function LowestProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    startingPrice: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getLowestPriceProductApi();
      
      setProducts(response.data.lowestPriceProducts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'startingPrice' ? parseFloat(value) || '' : value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      setFormData({
        ...formData,
        image: imageFile
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('description', formData.description);
      formDataToSend.append('startingPrice', formData.startingPrice);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
  
      await createLowestPriceProductApi(formDataToSend);
  
      setShowAddModal(false);
      resetForm();
      fetchProducts();
      showNotification('Product added successfully!', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding product');
      showNotification('Failed to add product. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('description', formData.description);
      formDataToSend.append('lowestPrice', formData.startingPrice); // Note the field name change here
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
  
      await updateLowestPriceProductApi(selectedProduct._id, formDataToSend);
  
      setShowEditModal(false);
      resetForm();
      fetchProducts();
      showNotification('Product updated successfully!', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating product');
      showNotification('Failed to update product. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    setLoading(true);
  
    try {
      await deleteLowestPriceProductApi(selectedProduct._id);
      setShowDeleteModal(false);
      fetchProducts();
      showNotification('Product deleted successfully!', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting product');
      showNotification('Failed to delete product. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };
  

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      description: product.description,
      startingPrice: product.startingPrice,
      image: null
    });
    setPreviewImage(`${BASE_URL}/uploads/${product.image}`);
    setShowEditModal(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      description: '',
      startingPrice: '',
      image: null
    });
    setPreviewImage(null);
    setSelectedProduct(null);
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  return (
    <Container fluid className="lowest-product-admin">
      <div className="admin-header">
        <h2>Lowest Price Products Management</h2>
        <Button 
          variant="primary" 
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <i className="fas fa-plus"></i> Add New Product
        </Button>
      </div>

      {notification.show && (
        <Alert variant={notification.type} className="mt-3">
          {notification.message}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {loading && !showAddModal && !showEditModal && !showDeleteModal ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <Card className="text-center mt-4">
              <Card.Body>
                <Card.Title>No Products Found</Card.Title>
                <Card.Text>Add new products to display them here.</Card.Text>
              </Card.Body>
            </Card>
          ) : (
            <Row className="mt-4">
              {products.map(product => (
                <Col md={4} sm={6} key={product._id} className="mb-4">
                  <Card className="product-card h-100">
                    <div className="product-image-container">
                      <Card.Img 
                        variant="top" 
                        src={`${BASE_URL}/uploads/${product.image}`} 
                        alt={product.description} 
                        className="product-image"
                      />
                    </div>
                    <Card.Body>
                      <Card.Title className="product-title">{product.description}</Card.Title>
                      <Card.Text>
                        <Badge bg="success" className="price-badge">
                          Starting from ₹{product.startingPrice}
                        </Badge>
                      </Card.Text>
                      <div className="product-actions">
                        <Button 
                          variant="outline-primary" 
                          onClick={() => openEditModal(product)}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          onClick={() => openDeleteModal(product)}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </Button>
                      </div>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                      Created: {new Date(product.createdAt).toLocaleDateString()}
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Lowest Price Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Enter product description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Starting Price (₹)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleInputChange}
                required
                placeholder="Enter starting price"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
                required
                accept="image/*"
              />
            </Form.Group>
            {previewImage && (
              <div className="text-center mt-3">
                <h6>Image Preview:</h6>
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="img-thumbnail preview-image" 
                />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="ms-2">Saving...</span>
                </>
              ) : (
                'Save Product'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Lowest Price Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Enter product description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Starting Price (₹)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleInputChange}
                required
                placeholder="Enter starting price"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
              />
              <Form.Text className="text-muted">
                Leave empty to keep the current image
              </Form.Text>
            </Form.Group>
            {previewImage && (
              <div className="text-center mt-3">
                <h6>Current Image:</h6>
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="img-thumbnail preview-image" 
                />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="ms-2">Updating...</span>
                </>
              ) : (
                'Update Product'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this product?
          {selectedProduct && (
            <div className="text-center mt-3">
              <img 
                src={`${BASE_URL}/uploads/${selectedProduct.image}`} 
                alt={selectedProduct.description} 
                className="img-thumbnail delete-preview" 
              />
              <p className="mt-2"><strong>{selectedProduct.description}</strong></p>
              <p>Starting Price: ₹{selectedProduct.startingPrice}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="ms-2">Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default LowestProduct;