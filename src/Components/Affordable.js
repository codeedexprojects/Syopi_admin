import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Spinner, 
  Modal, Form, Table
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSave, FaTimes } from 'react-icons/fa';
import './Affordable.css';
import { 
  createAffordableProductApi, 
  deleteAffordableProductApi, 
  getAllAffordableProductsApi, 
  updateAffordableProductApi 
} from '../services/allApi';
import { BASE_URL } from '../services/baseUrl';

function AffordableProductsAdmin() {
  // States
  const [affordableProducts, setAffordableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  
  // Form states
  const [currentProduct, setCurrentProduct] = useState({
    description: '',
    affordablePrice: '',
    image: null,
    imagePreview: null
  });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllAffordableProductsApi();
      setAffordableProducts(response.data.affordableProducts);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      setLoading(false);
      // console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image changes
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentProduct(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  // Add new product
  const handleAddProduct = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('description', currentProduct.description);
      formData.append('affordablePrice', currentProduct.affordablePrice);
      if (currentProduct.image) {
        formData.append('image', currentProduct.image);
      }

      const response = await createAffordableProductApi(formData);
      
      if (response.data) {
        await fetchProducts();
        setShowAddModal(false);
        resetForm();
      }
    } catch (err) {
      // console.error('Error adding product:', err);
      setError('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const handleUpdateProduct = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('description', currentProduct.description);
      formData.append('affordablePrice', currentProduct.affordablePrice);
      if (currentProduct.image && typeof currentProduct.image !== 'string') {
        formData.append('image', currentProduct.image);
      }

      const response = await updateAffordableProductApi(currentProduct._id, formData);
      
      if (response.data) {
        await fetchProducts();
        setShowEditModal(false);
        resetForm();
      }
    } catch (err) {
      // console.error('Error updating product:', err);
      setError('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      
      await deleteAffordableProductApi(currentProduct._id);
      await fetchProducts();
      setShowDeleteModal(false);
      
    } catch (err) {
      // console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentProduct({
      description: '',
      affordablePrice: '',
      image: null,
      imagePreview: null
    });
  };

  // Open edit modal
  const openEditModal = (product) => {
    setCurrentProduct({
      ...product,
      imagePreview: product.image ? `${BASE_URL}/uploads/${product.image}` : null
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (product) => {
    setCurrentProduct(product);
    setShowDeleteModal(true);
  };

  // Filter products based on search term
  const filteredProducts = affordableProducts.filter(product => 
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading && affordableProducts.length === 0) {
    return (
      <div className="affordableAdmin__loading">
        <Spinner animation="border" variant="primary" />
        <p>Loading affordable products...</p>
      </div>
    );
  }

  // Error state
  if (error && affordableProducts.length === 0) {
    return (
      <div className="affordableAdmin__error">
        <h4>{error}</h4>
        <Button variant="outline-primary" onClick={fetchProducts}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Container fluid className="affordableAdmin">
      <div className="affordableAdmin__header">
        <div className="affordableAdmin__title">
          <h2>Affordable Products Management</h2>
          <p>Manage your budget-friendly product offerings</p>
        </div>
        
        <div className="affordableAdmin__controls">
          <div className="affordableAdmin__search">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="affordableAdmin__viewToggle">
            <Button 
              variant={viewMode === 'grid' ? 'primary' : 'light'}
              onClick={() => setViewMode('grid')}
              className="viewBtn"
            >
              Grid
            </Button>
            <Button 
              variant={viewMode === 'table' ? 'primary' : 'light'}
              onClick={() => setViewMode('table')}
              className="viewBtn"
            >
              Table
            </Button>
          </div>
          
          <Button 
            className="affordableAdmin__addBtn" 
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            <FaPlus /> Add Product
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <Row className="affordableAdmin__products">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="affordableAdmin__card">
                  <div className="affordableAdmin__imgContainer">
                    <Card.Img
                      src={`${BASE_URL}/uploads/${product.image}`}
                      alt={product.description}
                      className="affordableAdmin__productImg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
                      }}
                    />
                    <div className="affordableAdmin__actions">
                      <Button 
                        className="affordableAdmin__editBtn" 
                        onClick={() => openEditModal(product)}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        className="affordableAdmin__deleteBtn" 
                        onClick={() => openDeleteModal(product)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Text className="affordableAdmin__description">
                      {product.description}
                    </Card.Text>
                    <div className="affordableAdmin__priceTag">
                      <span className="affordableAdmin__currency">₹</span>
                      <span className="affordableAdmin__amount">{parseFloat(product.affordablePrice).toFixed(2)}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <div className="affordableAdmin__empty">
                <p>No affordable products available. Add your first product!</p>
                <Button 
                  className="affordableAdmin__addEmptyBtn" 
                  onClick={() => {
                    resetForm();
                    setShowAddModal(true);
                  }}
                >
                  <FaPlus /> Add Product
                </Button>
              </div>
            </Col>
          )}
        </Row>
      ) : (
        <div className="affordableAdmin__tableView">
          <Table striped hover responsive className="affordableAdmin__table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Description</th>
                <th>Price (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={`${BASE_URL}/uploads/${product.image}`}
                        alt={product.description}
                        className="affordableAdmin__tableImg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                        }}
                      />
                    </td>
                    <td>{product.description}</td>
                    <td>₹ {parseFloat(product.affordablePrice).toFixed(2)}</td>
                    <td>
                      <Button 
                        className="affordableAdmin__tableEditBtn" 
                        onClick={() => openEditModal(product)}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button 
                        className="affordableAdmin__tableDeleteBtn" 
                        onClick={() => openDeleteModal(product)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      {/* Add Product Modal */}
      <Modal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)}
        centered
        className="affordableAdmin__modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Affordable Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={currentProduct.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                name="affordablePrice"
                value={currentProduct.affordablePrice}
                onChange={handleInputChange}
                placeholder="Enter product price"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <div className="affordableAdmin__uploadContainer">
                {currentProduct.imagePreview && (
                  <div className="affordableAdmin__previewContainer">
                    <img 
                      src={currentProduct.imagePreview} 
                      alt="Preview" 
                      className="affordableAdmin__preview" 
                    />
                    <Button 
                      className="affordableAdmin__removePreview"
                      onClick={() => setCurrentProduct(prev => ({
                        ...prev,
                        image: null,
                        imagePreview: null
                      }))}
                    >
                      <FaTimes />
                    </Button>
                  </div>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="affordableAdmin__fileInput"
                />
                <Button className="affordableAdmin__uploadBtn">
                  Choose Image
                </Button>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button 
            className="affordableAdmin__saveBtn" 
            onClick={handleAddProduct}
            disabled={!currentProduct.description || !currentProduct.affordablePrice}
          >
            <FaSave /> Save Product
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        centered
        className="affordableAdmin__modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Affordable Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={currentProduct.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                name="affordablePrice"
                value={currentProduct.affordablePrice}
                onChange={handleInputChange}
                placeholder="Enter product price"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <div className="affordableAdmin__uploadContainer">
                {currentProduct.imagePreview && (
                  <div className="affordableAdmin__previewContainer">
                    <img 
                      src={currentProduct.imagePreview} 
                      alt="Preview" 
                      className="affordableAdmin__preview" 
                    />
                    <Button 
                      className="affordableAdmin__removePreview"
                      onClick={() => setCurrentProduct(prev => ({
                        ...prev,
                        image: prev.image && typeof prev.image === 'string' ? prev.image : null,
                        imagePreview: null
                      }))}
                    >
                      <FaTimes />
                    </Button>
                  </div>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="affordableAdmin__fileInput"
                />
                <Button className="affordableAdmin__uploadBtn">
                  {currentProduct.imagePreview ? 'Change Image' : 'Choose Image'}
                </Button>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            className="affordableAdmin__saveBtn" 
            onClick={handleUpdateProduct}
            disabled={!currentProduct.description || !currentProduct.affordablePrice}
          >
            <FaSave /> Update Product
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        className="affordableAdmin__deleteModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this product?</p>
          <div className="affordableAdmin__deletePreview">
            {currentProduct.image && (
              <img 
                src={`${BASE_URL}/uploads/${currentProduct.image}`}
                alt={currentProduct.description}
                className="affordableAdmin__deleteImg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                }}
              />
            )}
            <div>
              <p className="affordableAdmin__deleteText">{currentProduct.description}</p>
              <p className="affordableAdmin__deletePrice">
                <span className="affordableAdmin__currency">₹</span> 
                {parseFloat(currentProduct.affordablePrice).toFixed(2)}
              </p>
            </div>
          </div>
          <p className="affordableAdmin__deleteWarning">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button className="affordableAdmin__confirmDeleteBtn" onClick={handleDeleteProduct}>
            <FaTrash /> Delete Product
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AffordableProductsAdmin;