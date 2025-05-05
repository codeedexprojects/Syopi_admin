import React, { useEffect, useState } from "react";
import "./offer.css";
import { Col, Form, Modal, Row, Toast } from "react-bootstrap";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FaChevronDown } from "react-icons/fa";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import {
  createofferApi,
  deleteOfferApi,
  getallProducts,
  getCategoriesApi,
  getOfferApi,
  getOfferbyID,
  getSubCategoriesApi,
  updateofferApi,
} from "../services/allApi";
import HashLoader from "react-spinners/HashLoader";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";

function Offer() {
  const [show, setShow] = useState(false);
  const [editshow, seteditShow] = useState(false);

  const [showoffer, setShowOffer] = useState(false);
  const [rows, setRows] = useState([]);

  const handleCloseoffer = () => setShowOffer(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [subcategories, setsubCategories] = useState([]);
  const [offerName, setOfferName] = useState("");
  const [offerType, setOfferType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const [expiryDate, setExpiryDate] = useState(null);
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState("");
  const [selectedOfferName, setSelectedOfferName] = useState("");
  const [selectedOfferType, setSelectedOfferType] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [product, setProduct] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
 const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const handleEditShow = (offer) => {
    setSelectedAmount(offer.amount);
    setSelectedOfferName(offer.offerName);
    setSelectedOfferType(offer.offerType);
    const mappedCategories = offer.category.map((category) => ({
      label: category.name,
      value: category._id,
    }));
    const mappedSubcategories = offer.subcategory.map((subcategory) => ({
      label: subcategory.name,
      value: subcategory._id,
    }));
    const mappedProducts = offer.products.map((product) => ({
      label: product.name,
      value: product._id,
    }));
    setSelectedCategory(mappedCategories); // Array of selected categories
    setSelectedSubCategory(mappedSubcategories); // Array of selected subcategories
    setSelectedProduct(mappedProducts); // Array of selected products

    seteditShow(true);
    setSelectedId(offer._id);
    setSelectedOfferId(offer._id);
  };
  const handleShowOffer = async (offerId) => {
    try {
      const offerDetails = await getOfferbyID(offerId);
      setSelectedOffer(offerDetails.data.offer);

      setShowOffer(true);
    } catch (error) {
      console.error("Error fetching offer details:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getallProducts();
      console.log(response);

      if (response.success && Array.isArray(response.data.products)) {
        setProduct(response.data.products);
        setProduct(
          response.data.products.map((cat) => ({
            value: cat._id,
            label: cat.name,
          }))
        );
      } else {
        console.error(
          "Failed to fetch products:",
          response.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const handleEditOffer = async (e) => {
    e.preventDefault();

    console.log("Button clicked");
    console.log({
      offerName,
      offerType,
      amount,
      startDate,
      expiryDate,
      selectedCategory,
    });

    if (
      !selectedOfferName ||
      !selectedOfferType ||
      !selectedAmount ||
      !startDate ||
      !expiryDate ||
      !selectedCategory
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    console.log("Proceeding with form submission");

    const offerData = {
      offerName: selectedOfferName,
      offerType: selectedOfferType,
      amount: selectedAmount,
      startDate,
      expireDate: expiryDate,
      category: selectedCategory.map((category) => category.value),
      subcategory: selectedSubCategory.map(
        (subcategories) => subcategories.value
      ),
      products: selectedProduct.map((product) => product.value),
    };

    const offerId = selectedOfferId; // Ensure this contains the correct ID

    try {
      console.log("Sending offer data:", offerData);
      const response = await updateofferApi(offerId, offerData); // Pass the offerId along with offerData

      // Log the entire response object to inspect it
      console.log("API Response:", response);

      if (response.status === 200) {
        toast.success("Offer updated successfully!");
        fetchOffers(); // Check if fetchOffers() is fetching the updated data
        handleEditClose();
      } else {
        console.error("Failed to update offer:", response.data);
        throw new Error(response.data.message || "Unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error updating offer:", error);
      console.error(
        "Error details:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        `Failed to update offer: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };
  const handleProductChange = (selectedProductOptions) => {
    setSelectedProduct(selectedProductOptions);
  };

  const handleEditClose = () => {
    seteditShow(false);
  };

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOfferApi();
      console.log(response);

      if (response && response.data) {
        setRows(response.data.offers);
        setTotalPages(Math.ceil(response.data.offers.length / rowsPerPage));

        console.log(response);
      }
    } catch (err) {
      setError("Failed to fetch offer. Please try again.");
      console.error("Error fetching offer data:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOffers();
  }, []);
 useEffect(() => {
    if (rows.length > 0) {
      setTotalPages(Math.ceil(rows.length / rowsPerPage));
    }
  }, [rows, rowsPerPage]);
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    const newRowsPerPage = parseInt(e.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const getCurrentRows = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return rows.slice(startIndex, endIndex);
  };

  // Calculate pagination numbers
  const getPaginationNumbers = () => {
    const maxPagesToShow = 5;
    let paginationNumbers = [];
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      paginationNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Show a subset of pages with ellipsis
      if (currentPage <= 3) {
        paginationNumbers = [1, 2, 3, 4, 5, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        paginationNumbers = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        paginationNumbers = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }
    
    return paginationNumbers;
  };

  // Get starting index for serial number
  const getStartIndex = () => {
    return (currentPage - 1) * rowsPerPage;
  };
  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();
      if (response.success && Array.isArray(response.data)) {
        setCategories(
          response.data.map((cat) => ({ value: cat._id, label: cat.name }))
        );
      } else {
        console.error(
          "Failed to fetch categories:",
          response.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchsubCategories = async () => {
    try {
      const response = await getSubCategoriesApi();
      if (response.success && Array.isArray(response.data.subCategories)) {
        // Map API response to react-select format
        setsubCategories(
          response.data.subCategories.map((cat) => ({
            value: cat._id,
            label: cat.name,
          }))
        );
      } else {
        console.error(
          "Failed to fetch subcategories:",
          response.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error.message);
    }
  };

  useEffect(() => {
    fetchsubCategories();
  }, []);

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategory(selectedOptions);
  };
  const handlesubCategoryChange = (selectedSubcategoryOptions) => {
    setSelectedSubCategory(selectedSubcategoryOptions);
  };

  const handleAddOffer = async () => {
    if (
      !offerName ||
      !offerType ||
      !amount ||
      !startDate ||
      !expiryDate ||
      !selectedCategory ||
      !selectedProduct
    ) {
      toast.error("Please fill in all required fields, including the image.");
      return;
    }
    const ownerId = localStorage.getItem("adminId");

    const offerData = {
      offerName,
      offerType,
      amount,
      startDate: startDate,
      expireDate: expiryDate,
      category: selectedCategory.map((category) => category.value),
      subcategory: selectedSubCategory.map(
        (subcategories) => subcategories.value
      ),
      ownerId: ownerId,
      products: selectedProduct.map((product) => product.value),
    };
    console.log(selectedProduct);

    try {
      const response = await createofferApi(offerData);
      if (response.success) {
        toast.success("offer added successfully!");
        fetchOffers();
        handleClose();
      } else {
        throw new Error(response.data.message || "Unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error(
        `Failed to add category: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleDeleteModalClose = () => setShowDeleteModal(false);
  const handleDeleteModalShow = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) {
      toast.error("No offer selected for deletion");
      return;
    }

    try {
      const response = await deleteOfferApi(selectedId);

      if (response.success) {
        toast.success("Sub-category deleted successfully");
        fetchOffers(); // Refresh the list after deletion
        handleDeleteModalClose();
      } else {
        toast.error(response.error || "Failed to delete Offer");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  const deleteModal = (
    <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="category-modal-title">
          Confirm Deletion
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-with-scroll">
        <p className="delete-modal-text">
          Are you sure you want to delete this Offer This action cannot be
          undone.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Row className="w-100">
          <Col>
            <button
              className="w-100 category-model-cancel"
              onClick={handleDeleteModalClose}
            >
              Cancel
            </button>
          </Col>
          <Col>
            <button
              className="w-100 category-model-add"
              onClick={handleDeleteConfirm}
            >
              Delete
            </button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
  return (
    <div className="offer">
      <Row className="d-flex justify-content-between">
        <Col md={7}>
          <p className="Product-heading">Offer</p>
        </Col>
        <Col md={2} className="d-flex justify-content-end">
          <button className="w-100 addoffer-button" onClick={handleShow}>
            Add offer
            <span className="ms-3">+</span>
          </button>
        </Col>
      </Row>

      <div className="coupon-table-container">
      {loading ? (
        <div className="spinner-overlay">
          <HashLoader color="#36d7b7" size={60} />
        </div>
      ) : error ? (
        <Toast>
          <Toast.Body className="text-danger">
            {error} {/* Show the error message in a Toast */}
          </Toast.Body>
        </Toast>
      ) : (
        <>
          {/* Pagination controls - top */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span>Show </span>
              <select
                className="form-select form-select-sm d-inline-block"
                style={{ width: '80px' }}
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span> entries</span>
            </div>
            <div>
              <span>Total Offers: {rows.length}</span>
            </div>
          </div>

          {/* Table */}
          <TableContainer component={Paper} className="Dproduct">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="dproduct-tablehead">#</TableCell>{" "}
                  {/* Serial Number */}
                  <TableCell className="dproduct-tablehead">Name</TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Status
                  </TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Type
                  </TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Amount
                  </TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getCurrentRows().map((row, index) => (
                  <TableRow
                    key={row._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left" className="dproduct-tabledata">
                      {getStartIndex() + index + 1}
                    </TableCell>
                    <TableCell
                      align="left"
                      className="dproduct-tabledata"
                      onClick={() => handleShowOffer(row._id)}
                      style={{ cursor: "pointer" }}
                    >
                      {row.offerName}
                    </TableCell>
                    <TableCell align="left" className="dproduct-tabledata">
                      {row.status}
                    </TableCell>
                    <TableCell align="left" className="dproduct-tabledata">
                      {row.offerType}
                    </TableCell>
                    <TableCell align="left" className="dproduct-tabledata">
                      {row.amount}
                    </TableCell>
                    <TableCell align="left">
                      <span
                        className="edit-offer"
                        onClick={() => handleEditShow(row)}
                      >
                        Edit
                      </span>
                      <span
                        className="ms-3 remove-offer"
                        onClick={() => handleDeleteModalShow()}
                      >
                        Remove
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination info and controls - bottom */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {rows.length > 0 ? getStartIndex() + 1 : 0} to {Math.min(getStartIndex() + rowsPerPage, rows.length)} of {rows.length} entries
            </div>
            <nav aria-label="Offer pagination">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                
                {getPaginationNumbers().map((pageNumber, index) => (
                  <li 
                    key={index} 
                    className={`page-item ${pageNumber === currentPage ? 'active' : ''} ${pageNumber === '...' ? 'disabled' : ''}`}
                  >
                    <button 
                      className="page-link"
                      onClick={() => pageNumber !== '...' && handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>

      {deleteModal}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        style={{ borderRadius: "22px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="category-modal-title">Add Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Offer Name
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter Offer name"
                    value={offerName}
                    onChange={(e) => setOfferName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Offer Type
                  </Form.Label>
                  <div className="dropdown-wrapper">
                    <Form.Control
                      className="single-product-form custom-dropdown"
                      as="select"
                      defaultValue=""
                      value={offerType}
                      onChange={(e) => setOfferType(e.target.value)}
                      aria-label="Select Offer Type"
                    >
                      <option value="">Select Offer Type</option>
                      <option value="percentage">percentage</option>
                      <option value="fixed">fixed</option>
                      <option value="buy_one_get_one">buy one get one</option>
                      <option value="free_shipping">free shipping</option>
                    </Form.Control>
                    <FaChevronDown className="dropdown-icon" />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Amount
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter Offer amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Form.Group>
                    <Form.Label className="single-product-form-label">
                      Start Date
                    </Form.Label>
                    <div className="input-with-icon">
                      <DateTimePicker
                        style={{ border: "none" }}
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="single-product-form datetime-picker"
                      />
                    </div>
                  </Form.Group>
                </LocalizationProvider>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Form.Group>
                    <Form.Label className="single-product-form-label">
                      Expiry Date
                    </Form.Label>
                    <div className="input-with-icon">
                      <DateTimePicker
                        style={{ border: "none" }}
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                        value={expiryDate}
                        onChange={(date) => setExpiryDate(date)}
                        className="single-product-form datetime-picker"
                      />
                    </div>
                  </Form.Group>
                </LocalizationProvider>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Category
                  </Form.Label>
                  <Select
                    isMulti
                    options={categories}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    placeholder="Select categories"
                    className="custom-react-select "
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Sub Category
                  </Form.Label>
                  <Select
                    isMulti
                    options={subcategories}
                    value={selectedSubCategory}
                    onChange={handlesubCategoryChange}
                    placeholder="Select subcategories"
                    className="custom-react-select"
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Product
                  </Form.Label>
                  <Select
                    isMulti
                    options={product}
                    value={selectedProduct}
                    onChange={handleProductChange}
                    placeholder="Select products"
                    className="custom-react-select"
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Row className="justify-content-center">
            <Col md={6}>
              <button onClick={handleClose} className="offer-modal-cancel">
                Cancel
              </button>
            </Col>
            <Col md={6}>
              <button onClick={handleAddOffer} className="offer-modal-add">
                Add offer
              </button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showoffer}
        onHide={handleCloseoffer}
        backdrop="static"
        keyboard={false}
        style={{ borderRadius: "22px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="category-modal-title">Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <div>
          {selectedOffer && (
            <Row className="offer-modal-row">
              <Col md={6}>
                <p className="offer-modal-title">Offer Name</p>
                <p className="offer-modal-subtitle">
                  {selectedOffer.offerName}
                </p>
              </Col>
              <Col md={6}>
                <p className="offer-modal-title">Type</p>
                <p className="offer-modal-subtitle">
                  {selectedOffer.offerType}
                </p>
              </Col>
              <Col md={6} className="mt-3">
                <p className="offer-modal-title">Amount</p>
                <p className="offer-modal-subtitle">{selectedOffer.amount}</p>
              </Col>
              <Col md={6} className="mt-3">
                <p className="offer-modal-title">Expires on</p>
                <p className="offer-modal-subtitle">
                  {new Date(selectedOffer.expireDate).toLocaleDateString(
                    "en-GB"
                  )}
                </p>
              </Col>
              <Col md={6} className="mt-3">
                <p className="offer-modal-title">Status</p>
                <p className="offer-modal-subtitle">{selectedOffer.status}</p>
              </Col>
              <Col md={6} className="mt-3">
                <p className="offer-modal-title">Category</p>
                <p className="offer-modal-subtitle">
                  {selectedOffer.category.name}
                </p>
              </Col>
              <Col md={6} className="mt-3">
                <p className="offer-modal-title">Sub Category</p>
                <p className="offer-modal-subtitle">
                  {selectedOffer.category.name}
                </p>
              </Col>
              <Col md={6} className="mt-3">
                <p className="offer-modal-title">Product Code</p>
                <p className="offer-modal-subtitle">
                  {selectedOffer.productCode}
                </p>
              </Col>
            </Row>
          )}
        </div>
      </Modal>

      <Modal
        show={editshow}
        onHide={handleEditClose}
        backdrop="static"
        keyboard={false}
        style={{ borderRadius: "22px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="category-modal-title">Edit Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditOffer}>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Offer Name
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter Offer name"
                    value={selectedOfferName}
                    onChange={(e) => setSelectedOfferName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Offer Type
                  </Form.Label>
                  <div className="dropdown-wrapper">
                    <Form.Control
                      className="single-product-form custom-dropdown"
                      as="select"
                      value={selectedOfferType}
                      onChange={(e) => setSelectedOfferType(e.target.value)}
                      aria-label="Select Offer Type"
                    >
                      <option value="">Select Offer Type</option>
                      <option value="percentage">percentage</option>
                      <option value="fixed">fixed</option>
                      <option value="buy_one_get_one">buy one get one</option>
                      <option value="free_shipping">free shipping</option>
                    </Form.Control>
                    <FaChevronDown className="dropdown-icon" />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Amount
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter Offer amount"
                    value={selectedAmount}
                    onChange={(e) => setSelectedAmount(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Form.Group>
                    <Form.Label className="single-product-form-label">
                      Start Date
                    </Form.Label>
                    <div className="input-with-icon">
                      <DateTimePicker
                        style={{ border: "none" }}
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="single-product-form datetime-picker"
                      />
                    </div>
                  </Form.Group>
                </LocalizationProvider>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Form.Group>
                    <Form.Label className="single-product-form-label">
                      Expiry Date
                    </Form.Label>
                    <div className="input-with-icon">
                      <DateTimePicker
                        style={{ border: "none" }}
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                        value={expiryDate}
                        onChange={(date) => setExpiryDate(date)}
                        className="single-product-form datetime-picker"
                      />
                    </div>
                  </Form.Group>
                </LocalizationProvider>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Category
                  </Form.Label>
                  <Select
                    isMulti
                    options={categories}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    placeholder="Select categories"
                    className="custom-react-select"
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Sub Category
                  </Form.Label>
                  <Select
                    isMulti
                    options={subcategories}
                    value={selectedSubCategory}
                    onChange={handlesubCategoryChange}
                    placeholder="Select subcategories"
                    className="custom-react-select"
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Product
                  </Form.Label>
                  <Select
                    isMulti
                    options={product}
                    value={selectedProduct}
                    onChange={handleProductChange}
                    placeholder="Select products"
                    className="custom-react-select"
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Row className="justify-content-center">
            <Col md={6}>
              <button onClick={handleEditClose} className="offer-modal-cancel">
                Cancel
              </button>
            </Col>
            <Col md={6}>
              <button className="offer-modal-add" onClick={handleEditOffer}>
                Edit offer
              </button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default Offer;
