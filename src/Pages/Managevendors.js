import * as React from "react";
import "./products.css";
import "./managevendors.css";
import { Col, Row, Card, Form, FormControl, Toast } from "react-bootstrap";
import { RiArrowDropDownLine } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { Pagination } from "@mui/material";
import { AiFillStar, AiOutlineShopping } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdBusiness } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getallVendors } from "../services/allApi";
import { useState } from "react";
import { useEffect } from "react";
import { BASE_URL } from "../services/baseUrl";
import HashLoader from "react-spinners/HashLoader";

function Managevendors() {
  const navigate = useNavigate();

  const handleNavigation = (id) => {
    navigate(`/vendorprofile/${id}`);
  };

  const handleaddNavigation = () => {
    navigate("/addvendor");
  };

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const fetchvendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getallVendors();
      if (response && response.data) {
        setVendors(response.data);
      }
    } catch (err) {
      setError("Failed to fetch offer. Please try again.");
      console.error("Error fetching offer data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchvendors();
  }, []);

  // Filter vendors based on the search query
  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.businessname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.businesslocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="Products">
      <p className="Product-heading">Manage Vendors</p>
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
              value={searchQuery} // Bind input value to searchQuery
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
            />
          </Form>
        </Col>
        <Col md={1}>
          <button className="w-100 add-product-dd">
            All <RiArrowDropDownLine />
          </button>
        </Col>
        <Col md={3}>
          <button
            onClick={handleaddNavigation}
            className="w-100 add-product-button"
          >
            Add Vendors <span className="ms-3">+</span>
          </button>
        </Col>
      </Row>

      <Row className="mt-4">
        {/* Display filtered vendors or a 'No vendors' message if no vendors match the search */}
        {filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => (
            <Col md={3} key={vendor.id} className="mb-4">
              <Card
                className="vendor-card"
                onClick={() => handleNavigation(vendor._id)}
              >
                <div className="vendor-card-img-container">
                  <Card.Img
                    variant="top"
                    src={`${BASE_URL}/uploads/${vendor.images[0]}`}
                    className="vendor-img"
                  />
                  <div className="image-overlay"></div>
                  <div className="vendor-info">
                    <span className="shop-name">{vendor.businessname}</span>
                    <div className="rating">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <AiFillStar color="gold" />
                        <span style={{ marginLeft: "5px" }}>
                          {vendor.ratingsAverage.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Card.Body className="p-0 m-0">
                  <Row className="vendor-info-row mt-3">
                    <Col xs={6} className="d-flex align-items-center">
                      <FaMapMarkerAlt className="vendor-icon vendor-description" />
                      <span className="vendor-location vendor-description">
                        {vendor.businesslocation}
                      </span>
                    </Col>
                    <Col
                      xs={6}
                      className="d-flex align-items-center justify-content-end"
                    >
                      <MdBusiness className="vendor-icon vendor-description" />
                      <span className="vendor-type vendor-description">
                        {vendor.storetype}
                      </span>
                    </Col>
                  </Row>
                  <Card.Text className="vendor-description mt-3">
                    {vendor.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center mt-4">
  <div className="no-vendors-container">
    <AiOutlineShopping size={50} color="#ccc" />
    <p className="no-vendors-message mt-3" style={{ fontSize: '18px', color: '#555', fontWeight: '600' }}>
      No vendors found
    </p>
    <p className="no-vendors-subtext" style={{ fontSize: '14px', color: '#888' }}>
      Try adjusting your search or adding a new vendor.
    </p>
  </div>
</Col>
        )}
      </Row>

      {loading ? (
        <div className="spinner-overlay">
          <HashLoader color="#36d7b7" size={40} />
        </div>
      ) : error ? (
        <Toast>
          <Toast.Body className="text-danger">{error}</Toast.Body>
        </Toast>
      ) : null}

      <Row className="mt-4 pagination-row">
        <Pagination className="pagination" count={10} variant="outlined" />
      </Row>
    </div>
  );
}

export default Managevendors;
