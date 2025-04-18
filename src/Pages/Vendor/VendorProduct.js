import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../products.css";
import { IoEllipsisVertical } from "react-icons/io5";
import { Col, Form, FormControl, Modal, Row, Toast } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { Pagination } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaEye, FaFlag } from "react-icons/fa";
import { getallvendorProducts } from "../../services/allApi";
import { BASE_URL } from "../../services/baseUrl";

function VendorProduct() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [show, setShow] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filters, setFilters] = useState({
    brand: [],
    minPrice: 0,
    maxPrice: 1000,
    stock: [],
    size: [],
    product_type: [],
  });

const [availableSizes, setAvailableSizes] = useState([]);

const brands = ["Nike", "Adidas", "Puma"];
const stocks = ["In Stock", "Out of Stock"];
const productTypes = ["Dress", "Chappal"];

// Define sizes based on product type
const sizeOptions = {
  Dress: ["S", "M", "L", "XL"],
  Chappal: ["6", "7", "8", "9", "10"],
};

// Update sizes when product type changes
useEffect(() => {
  if (filters.product_type.length === 1) {
    setAvailableSizes(sizeOptions[filters.product_type[0]] || []);
  } else {
    setAvailableSizes([]);
  }
}, [filters.product_type]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const toggleCheckbox = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedValues = prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value];
      return { ...prevFilters, [filterType]: updatedValues };
    });
  };

  const renderRightSection = () => {
    switch (activeFilter) {
      case "brand":
        return (
          <>
            <p className="single-product-form-label">Select Brand</p>
            {brands.map((brand) => (
              <Form.Check
                key={brand}
                type="checkbox"
                label={brand}
                checked={filters.brand.includes(brand)}
                onChange={() => toggleCheckbox("brand", brand)}
              />
            ))}
          </>
        );
      case "product_type":
        return (
          <>
            <p className="single-product-form-label">Select product type</p>
            <>
          <p className="single-product-form-label">Select Product Type</p>
          {productTypes.map((type) => (
            <Form.Check
              key={type}
              type="checkbox"
              label={type}
              checked={filters.product_type.includes(type)}
              onChange={() => toggleCheckbox("product_type", type)}
            />
          ))}
        </>
          </>
        );
      case "stock":
        return (
          <>
            <p className="single-product-form-label">Select Stock</p>
            {stocks.map((stock) => (
              <Form.Check
                key={stock}
                type="checkbox"
                label={stock}
                checked={filters.stock.includes(stock)}
                onChange={() => toggleCheckbox("stock", stock)}
              />
            ))}
          </>
        );
        case "size":
          return availableSizes.length > 0 ? (
            <>
              <p className="single-product-form-label">Select Size</p>
              {availableSizes.map((size) => (
                <Form.Check
                  key={size}
                  type="checkbox"
                  label={size}
                  checked={filters.size.includes(size)}
                  onChange={() => toggleCheckbox("size", size)}
                />
              ))}
            </>
          ) : (
            <p className="text-muted">Please select a product type first.</p>
          );
      case "minPrice":
        return (
          <>
            <p className="single-product-form-label">Set Min Price</p>
            <Form.Control
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
            />
          </>
        );
      case "maxPrice":
        return (
          <>
            <p className="single-product-form-label">Set Max Price</p>
            <Form.Control
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
            />
          </>
        );
      default:
        return (
          <>
          <p className="single-product-form-label">Select Product Type</p>
          {productTypes.map((type) => (
            <Form.Check
              key={type}
              type="checkbox"
              label={type}
              checked={filters.product_type.includes(type)}
              onChange={() => toggleCheckbox("product_type", type)}
            />
          ))}
        </>
        );
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  
  const fetchProducts = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getallvendorProducts(page, limit);
      console.log(response);
  
      if (response && response.data) {
        setRows(response.data.products);
        setTotalPages(Math.ceil(response.data.total / limit)); // Calculate total pages
      }
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
      console.error("Error fetching product data:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);
  

  const handlenavigation = () => {
    window.location.href = "/addvendorproducts";
  };

  const handlenavigatesingleproduct = (id) => {
    navigate(`/singlevendorproduct/${id}`);
  };

  const handleOpen = (id) => {
    setShowModal(true);
    setSelectedId(id);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  return (
    <div className="Products">
      <p className="Product-heading">Manage Products</p>
      <Row>
        <Col md={8}>
          {" "}
          <Form className="d-flex position-relative product-search-container">
            <CiSearch
              size={20}
              className="position-absolute text-muted search-icon"
            />
            <FormControl
              type="search"
              placeholder="Search"
              className=" product-search-input"
              aria-label="Search"
            />
          </Form>
        </Col>
        <Col md={1}>
          <button onClick={handleShow} className="w-100 add-product-dd">
            Filter
          </button>
        </Col>{" "}
        <Col md={3}>
          <button
            onClick={handlenavigation}
            className="w-100 add-product-button"
          >
            Add Product <span className="ms-3">+</span>
          </button>
        </Col>
      </Row>
      <div>
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
          <TableContainer component={Paper} className="product mt-4">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="product-tablehead">Product</TableCell>
                  <TableCell className="product-tablehead" align="left">
                    Supplier
                  </TableCell>
                  <TableCell className="product-tablehead" align="left">
                    Name
                  </TableCell>
                  <TableCell className="product-tablehead" align="left">
                    Brand
                  </TableCell>
                  <TableCell className="product-tablehead" align="left">
                    Code
                  </TableCell>
                  <TableCell className="product-tablehead" align="left">
                    Stock
                  </TableCell>
                  <TableCell className="product-tablehead" align="left">
                    Price
                  </TableCell>
                  <TableCell className="product-tablehead" align="left">
                    More
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row._id}
                    style={{ cursor: "pointer" }}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                    onClick={() => handlenavigatesingleproduct(row._id)}
                  >
                    <TableCell component="th" scope="row">
                      <img
                        src={`${BASE_URL}/uploads/${row.images[0]}`}
                        alt={row.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                        }}
                      />
                    </TableCell>
                    <TableCell align="left" className="product-tabledata">
                      {row.supplierName}
                    </TableCell>
                    <TableCell align="left" className="product-tabledata">
                      {row.name}
                    </TableCell>
                    <TableCell align="left" className="product-tabledata">
                      {row.brand}
                    </TableCell>
                    <TableCell align="left" className="product-tabledata">
                      {row.productCode}
                    </TableCell>
                    <TableCell align="left" className="product-tabledata">
                      {row.totalStock}
                    </TableCell>
                    <TableCell align="left" className="product-tabledata">
                      <ul style={{ listStyleType: "none", padding: 0 }}>
                        {row.variants.map((variant) => (
                          <li key={variant._id} style={{ marginBottom: "5px" }}>
                            <strong>Color:</strong> {variant.color} <br />
                            <strong>Price:</strong> ${variant.price} <br />
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell
                      onClick={(event) => {
                        event.stopPropagation();
                        handleOpen(row._id);
                      }}
                      align="left"
                      className="product-tablemore"
                    >
                      <IoEllipsisVertical />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      <Row className="mt-4 pagination-row">
  <Pagination
    className="pagination"
    count={totalPages}  // Dynamic page count
    page={currentPage}
    onChange={handlePageChange}
    variant="outlined"
  />
</Row>


      <Modal
        show={showModal}
        onHide={handleModalClose}
        centered
        ClassName="custom-modal-width"
      >
        <Modal.Body className="modal-body-with-scroll">
          <div
            className="modal-option"
            onClick={() => handlenavigatesingleproduct(selectedId)}
          >
            <FaEdit className="modal-icons" />
            <span>Edit</span>
          </div>
          <div
            className="modal-option"
            onClick={() => alert("Review clicked!")}
          >
            <FaEye className="modal-icons" />
            <span>Review</span>
          </div>
          <div
            className="modal-option"
            onClick={() => alert("Flagged clicked!")}
          >
            <FaFlag className="modal-icons" />
            <span>Flagged</span>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="category-modal-title">
            Filter Options
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* Left Sidebar */}
            <Col md={4} className="border-end pe-3">
              <Form>
              <div className="filter-group">
                  <p
                    className="  single-product-form-label"
                    onClick={() => setActiveFilter("product_type")}
                    style={{ cursor: "pointer" }}
                  >
                    Product Type
                  </p>
                </div>
                <div className="filter-group">
                  <p
                    className="  single-product-form-label"
                    onClick={() => setActiveFilter("brand")}
                    style={{ cursor: "pointer" }}
                  >
                    Brand
                  </p>
                </div>
                <div className="filter-group">
                  <p
                    className="  single-product-form-label"
                    onClick={() => setActiveFilter("minPrice")}
                    style={{ cursor: "pointer" }}
                  >
                    Min Price
                  </p>
                </div>
                <div className="filter-group">
                  <p
                    className="  single-product-form-label"
                    onClick={() => setActiveFilter("maxPrice")}
                    style={{ cursor: "pointer" }}
                  >
                    Max Price
                  </p>
                </div>
                <div className="filter-group">
                  <p
                    className="  single-product-form-label"
                    onClick={() => setActiveFilter("stock")}
                    style={{ cursor: "pointer" }}
                  >
                    Stock
                  </p>
                </div>
                <div className="filter-group">
                  <p
                    className="  single-product-form-label"
                    onClick={() => setActiveFilter("size")}
                    style={{ cursor: "pointer" }}
                  >
                    Size
                  </p>
                </div>
               
              </Form>
            </Col>

            {/* Right Section */}
            <Col md={8} className="ps-3">
              {renderRightSection()}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <button className="w-25 category-model-cancel" onClick={handleClose}>
            Close
          </button>
          <button className="w-25 category-model-add" onClick={handleClose}>
            Apply Filters
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VendorProduct;
