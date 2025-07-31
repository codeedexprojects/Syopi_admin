import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./products.css";
import { IoEllipsisVertical } from "react-icons/io5";
import { Col, Form, FormControl, Modal, Row, Toast } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { Pagination } from "@mui/material";
import { useEffect } from "react";
import { getAllBrandsApi, getallProducts } from "../services/allApi";
import { useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import { BASE_URL } from "../services/baseUrl";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaEye } from "react-icons/fa";

function Products() {
  // State for products data
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // State for modals
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [show, setShow] = useState(false);

  // State to track if filters are applied
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Filter states
  const [activeFilter, setActiveFilter] = useState("brand");
  const [filters, setFilters] = useState({
    brand: [],
    minPrice: 0,
    maxPrice: 1000,
    stock: [],
    size: [],
    product_type: [],
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Brand list from API
  const [brandsList, setBrandsList] = useState([]);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Show 10 items per page

  // Filter options
  const stocks = ["In Stock", "Out of Stock"];
  const sizes = ["S", "M", "L", "XL"];
  const product_type = ["Dress", "Chappal", "Shoes", "T-Shirt"];

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Toggle checkbox in filters
  const toggleCheckbox = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedValues = prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value];
      return { ...prevFilters, [filterType]: updatedValues };
    });
  };

  // Fetch brands from API
  const fetchBrands = async () => {
    try {
      const response = await getAllBrandsApi();

      if (response && response.data) {
        setBrandsList(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  // Render right section of filter modal based on active filter
  const renderRightSection = () => {
    switch (activeFilter) {
      case "brand":
        return (
          <>
            <p className="single-product-form-label">Select Brand</p>
            {brandsList.length > 0 ? (
              brandsList.map((brand) => (
                <Form.Check
                  key={brand._id || brand}
                  type="checkbox"
                  label={brand.name || brand}
                  checked={filters.brand.includes(brand.name || brand)}
                  onChange={() => toggleCheckbox("brand", brand.name || brand)}
                />
              ))
            ) : (
              <p>Loading brands...</p>
            )}
          </>
        );
      case "product_type":
        return (
          <>
            <p className="single-product-form-label">Select product type</p>
            {product_type.map((type) => (
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
        return (
          <>
            <p className="single-product-form-label">Select Size</p>
            {sizes.map((size) => (
              <Form.Check
                key={size}
                type="checkbox"
                label={size}
                checked={filters.size.includes(size)}
                onChange={() => toggleCheckbox("size", size)}
              />
            ))}
          </>
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
                setFilters({
                  ...filters,
                  minPrice: parseInt(e.target.value) || 0,
                })
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
                setFilters({
                  ...filters,
                  maxPrice: parseInt(e.target.value) || 1000,
                })
              }
            />
          </>
        );
      default:
        return (
          <>
            <p className="single-product-form-label">Select Brand</p>
            {brandsList.length > 0 ? (
              brandsList.map((brand) => (
                <Form.Check
                  key={brand._id || brand}
                  type="checkbox"
                  label={brand.name || brand}
                  checked={filters.brand.includes(brand.name || brand)}
                  onChange={() => toggleCheckbox("brand", brand.name || brand)}
                />
              ))
            ) : (
              <p>Loading brands...</p>
            )}
          </>
        );
    }
  };

  // Apply filters to the products
  const applyFilters = (products) => {
    // If no filters are applied and no search query, return all products
    if (!filtersApplied && !searchQuery) {
      return products;
    }

    return products.filter((product) => {
      // Filter by brand
      if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
        return false;
      }

      // Filter by product type
      if (
        filters.product_type.length > 0 &&
        !filters.product_type.includes(product.productType)
      ) {
        return false;
      }

      // Filter by stock
      if (filters.stock.length > 0) {
        const stockStatus =
          product.totalStock > 0 ? "In Stock" : "Out of Stock";
        if (!filters.stock.includes(stockStatus)) {
          return false;
        }
      }

      // Filter by size
      if (filters.size.length > 0) {
        const productSizes = product.variants
          ? product.variants.flatMap((v) => v.sizes || [])
          : [];
        if (!filters.size.some((size) => productSizes.includes(size))) {
          return false;
        }
      }

      // Filter by price range - only apply if min or max has been changed from defaults
      if (
        (filters.minPrice > 0 || filters.maxPrice < 1000) &&
        product.variants &&
        product.variants.length > 0
      ) {
        let hasPriceInRange = false;
        for (const variant of product.variants) {
          if (
            variant.price >= filters.minPrice &&
            variant.price <= filters.maxPrice
          ) {
            hasPriceInRange = true;
            break;
          }
        }
        if (!hasPriceInRange) {
          return false;
        }
      }

      // Filter by search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          (product.brand &&
            product.brand.toLowerCase().includes(searchLower)) ||
          (product.productCode &&
            product.productCode.toLowerCase().includes(searchLower)) ||
          (product.supplierName &&
            product.supplierName.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  };

  // Get the base price for a product (first variant or fallback)
  const getBasePrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].price;
    }
    return "-";
  };

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getallProducts();
      console.log(response);

      if (response && response.data) {
        setRows(response.data.products.reverse());
        setTotalPages(Math.ceil(response.data.products.length / itemsPerPage));
      }
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
      console.error("Error fetching product data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change for pagination
  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top of the page when changing pages
    window.scrollTo(0, 0);
  };

  const getPaginatedData = (data) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Apply filters and handle search
  const handleFiltersApply = () => {
    // Check if any filters are actually set
    const isFilterSet =
      filters.brand.length > 0 ||
      filters.product_type.length > 0 ||
      filters.stock.length > 0 ||
      filters.size.length > 0 ||
      filters.minPrice > 0 ||
      filters.maxPrice < 1000;

    setFiltersApplied(isFilterSet);
    handleClose();
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      brand: [],
      minPrice: 0,
      maxPrice: 1000,
      stock: [],
      size: [],
      product_type: [],
    });
    setFiltersApplied(false);
    handleClose();
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  useEffect(() => {
    if (rows.length > 0) {
      const filteredData = applyFilters(rows);
      setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
      if (page > Math.ceil(filteredData.length / itemsPerPage)) {
        setPage(1);
      }
    }
  }, [filters, searchQuery, rows, filtersApplied]);

  const handlenavigation = () => {
    navigate("/addproduct");
  };

  const handlenavigatesingleproduct = (id) => {
    navigate(`/singleproduct/${id}`);
  };

  const handleOpen = (id) => {
    setShowModal(true);
    setSelectedId(id);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  // Calculate filtered and paginated data
  const filteredData = rows.length > 0 ? applyFilters(rows) : [];
  const paginatedData = getPaginatedData(filteredData);

  // Debug information

  return (
    <div className="Products">
      <p className="Product-heading">Manage Products</p>
      <Row>
        <Col md={8}>
          <Form className="d-flex position-relative product-search-container">
            <CiSearch
              size={20}
              className="position-absolute text-muted search-icon"
            />
            <FormControl
              type="search"
              placeholder="Search"
              className="product-search-input"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Form>
        </Col>
        <Col md={1}>
          <button onClick={handleShow} className="w-100 add-product-dd">
            Filter {filtersApplied && <span className="ms-1">•</span>}
          </button>
        </Col>
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
            <Toast.Body className="text-danger">{error}</Toast.Body>
          </Toast>
        ) : (
          <TableContainer component={Paper} className="product mt-4">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="product-tablehead">SI No</TableCell>
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
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <TableRow
                      key={row._id}
                      style={{ cursor: "pointer" }}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      onClick={() => handlenavigatesingleproduct(row._id)}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        className="product-tabledata"
                      >
                        {(page - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <img
                          src={
                            row.images && row.images.length > 0
                              ? `${BASE_URL}/uploads/${row.images[0]}`
                              : "/placeholder.jpg"
                          }
                          alt={row.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                      </TableCell>
                      <TableCell align="left" className="product-tabledata">
                        {row.supplierName || "-"}
                      </TableCell>
                      <TableCell align="left" className="product-tabledata">
                        {row.name || "-"}
                      </TableCell>
                      <TableCell align="left" className="product-tabledata">
                        {row.brand?.name || row.brand}
                      </TableCell>

                      <TableCell align="left" className="product-tabledata">
                        {row.productCode || "-"}
                      </TableCell>
                      <TableCell align="left" className="product-tabledata">
                        {row.totalStock || 0}
                      </TableCell>
                      <TableCell align="left" className="product-tabledata">
                        ₹{getBasePrice(row)}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                      className="product-tabledata"
                    >
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      <Row className="mt-4 pagination-row">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            Showing {paginatedData.length} of {filteredData.length} products
          </div>
          <Pagination
            className="pagination"
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            color="primary"
          />
        </div>
      </Row>

      {/* Actions Modal */}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        centered
        className="custom-modal-width"
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
          {/* <div
            className="modal-option"
            onClick={() => alert("Flagged clicked!")}
          >
            <FaFlag className="modal-icons" />
            <span>Flagged</span>
          </div> */}
        </Modal.Body>
      </Modal>

      {/* Filter Modal */}
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
                    className="single-product-form-label"
                    onClick={() => setActiveFilter("brand")}
                    style={{
                      cursor: "pointer",
                      fontWeight: activeFilter === "brand" ? "bold" : "normal",
                    }}
                  >
                    Brand
                  </p>
                </div>
                <div className="filter-group">
                  <p
                    className="single-product-form-label"
                    onClick={() => setActiveFilter("minPrice")}
                    style={{
                      cursor: "pointer",
                      fontWeight:
                        activeFilter === "minPrice" ? "bold" : "normal",
                    }}
                  >
                    Min Price
                  </p>
                </div>
                <div className="filter-group">
                  <p
                    className="single-product-form-label"
                    onClick={() => setActiveFilter("maxPrice")}
                    style={{
                      cursor: "pointer",
                      fontWeight:
                        activeFilter === "maxPrice" ? "bold" : "normal",
                    }}
                  >
                    Max Price
                  </p>
                </div>
                <div className="filter-group">
                  <p
                    className="single-product-form-label"
                    onClick={() => setActiveFilter("stock")}
                    style={{
                      cursor: "pointer",
                      fontWeight: activeFilter === "stock" ? "bold" : "normal",
                    }}
                  >
                    Stock
                  </p>
                </div>
                <div className="filter-group">
                  <p
                    className="single-product-form-label"
                    onClick={() => setActiveFilter("size")}
                    style={{
                      cursor: "pointer",
                      fontWeight: activeFilter === "size" ? "bold" : "normal",
                    }}
                  >
                    Size
                  </p>
                </div>
                <div className="filter-group">
                  <p
                    className="single-product-form-label"
                    onClick={() => setActiveFilter("product_type")}
                    style={{
                      cursor: "pointer",
                      fontWeight:
                        activeFilter === "product_type" ? "bold" : "normal",
                    }}
                  >
                    Product Type
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
          <button
            className="w-25 category-model-cancel"
            onClick={handleResetFilters}
          >
            Reset
          </button>
          <button
            className="w-25 category-model-add"
            onClick={handleFiltersApply}
          >
            Apply Filters
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Products;
