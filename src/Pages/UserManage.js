import React, { useEffect, useState } from "react";
import { Col, Form, FormControl, Row, Card, Toast } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { IoFilter, IoChevronForward } from "react-icons/io5";
import "./usermanage.css";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getallUserApi, searchUsers } from "../services/allApi";
import HashLoader from "react-spinners/HashLoader";
function UserManage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  
  const userStats = [
    { title: "Most Wishlisted", number: 120 },
    { title: "Top Ordered", number: 95 },
    { title: "Popular Viewed", number: 300 },
    { title: "Total Users", number: 1500 },
    { title: "Active Users", number: 1200 },
    { title: "Inactive Users", number: 300 },
  ];
  const fetchUsers = async (query = "") => {
    setLoading(true);
    setError(null);

    try {
      const response = query ? await searchUsers(query) : await getallUserApi();

      if (response && response.data) {
        console.log(response);
        if (response.data.length === 0) {
          setRows([]);
          setError("No users found.");
        } else {
          setRows(response.data);
          setError(null);
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setRows([]);
        setError("No users found.");
      } else {
        setError("Failed to fetch user. Please try again.");
      }
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchUsers(searchQuery);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="usermanage">
      <p className="Product-heading">User management</p>
      <Row className="d-flex justify-content-between">
        <Col md={7}>
          <Form
            className="d-flex position-relative product-search-container"
            onSubmit={handleSearchSubmit}
          >
            <CiSearch
              size={20}
              className="position-absolute text-muted search-icon"
            />
            <FormControl
              type="search"
              placeholder="Search by name or phone"
              className="user-search-input"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Form>
        </Col>
        <Col md={2} className="d-flex justify-content-end">
          <button className="w-100 user-filter-button">
            Filter
            <span className="ms-3">
              <IoFilter />
            </span>
          </button>
        </Col>
      </Row>

      <Row className="mt-4">
      {userStats.map((stat, index) => (
        <Col md={2} className="mb-4" key={index}>
          <Card className="user-manage-card">
            <Card.Body>
              <Card.Title className="user-manage-card-heading">
                {stat.title}
              </Card.Title>
              <Card.Text className="user-manage-card-number">
                {stat.number}
              </Card.Text>
              <div className="d-flex justify-content-between align-items-center">
                <a
                  href="#j"
                  className="view-all-link-user d-flex align-items-center"
                >
                  View all
                  <IoChevronForward className="ms-1" />
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>

      <Row className="mt-3">
        {loading ? (
          <div className="spinner-overlay">
            <HashLoader color="#36d7b7" size={60} />
          </div>
        ) : error ? (
          <Toast>
            <Toast.Body className="text-danger">{error}</Toast.Body>
          </Toast>
        ) : rows.length === 0 ? (
          <div className="text-center">No users found.</div> // No data found message
        ) : (
          <TableContainer component={Paper} className="Dproduct">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="dproduct-tablehead">Name</TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Mobile Number
                  </TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Gender
                  </TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Refferal Code
                  </TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell align="left" className="dorder-tabledata">
                      {row.name}
                    </TableCell>
                    <TableCell align="left" className="dorder-tabledata">
                      {row.phone}
                    </TableCell>
                    <TableCell align="left" className="dorder-tabledata">
                      {row.gender}
                    </TableCell>
                    <TableCell align="left" className="dorder-tabledata">
                      {row.referralCode}
                    </TableCell>
                    <TableCell align="left" className="dorder-tabledata">
                      ...
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Row>
    </div>
  );
}

export default UserManage;
