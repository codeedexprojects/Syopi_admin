import React, { useEffect, useState } from "react";
import { Col, Form, FormControl, Row, Card, Toast, Button, Pagination } from "react-bootstrap";
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
import { useNavigate } from "react-router-dom";

function UserManage() {
  const [rows, setRows] = useState([]);
  const [allUsers, setAllUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiData, setApiData] = useState(null); 
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    gender: "",
    role: "",
    sortBy: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  const [userStats, setUserStats] = useState([
    { title: "Most Wishlisted", number: 0 },
    { title: "Top Ordered", number: 0 },
   
    { title: "Total Users", number: 0 },
    { title: "Active Users", number: 0 },
    { title: "Inactive Users", number: 0 },
  ]);

 const fetchData = async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await getallUserApi();
    console.log("API Response:", response);

    if (response && response.data) {
      const users = response.data.users || [];

      // Sort by createdAt descending (latest first)
      const sortedUsers = users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setApiData(response.data);
      setAllUsers(sortedUsers);

      // Update user stats
      updateUserStatsFromApi(response.data);

      // Apply initial filtering and pagination
      applyFiltersAndPagination(sortedUsers, searchQuery, filters);
    } else {
      setError("No data received from API");
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
    setError("Failed to fetch users. Please try again.");
  } finally {
    setLoading(false);
  }
};

  
  const updateUserStatsFromApi = (data) => {
    if (!data) return;
    
    const updatedStats = [
      { 
        title: "Most Wishlisted", 
        number: data.mostWishlistedProduct ? data.mostWishlistedProduct.count : 0 
      },
      { 
        title: "Top Ordered", 
        number: data.topOrderedProduct ? data.topOrderedProduct.count : 0 
      },
      // You may need to add this to your API response
     
      { title: "Total Users", number: data.totalUsers || 0 },
      { title: "Active Users", number: data.activeUsers || 0 },
      { title: "Inactive Users", number: data.inactiveUsers || 0 },
    ];
    
    setUserStats(updatedStats);
  };

  // Apply filters and search to the data
  const applyFiltersAndPagination = (users, query, filterOptions) => {
    if (!users || users.length === 0) {
      setRows([]);
      setTotalItems(0);
      return;
    }
    
    // First apply search filter
    let filteredData = users;
    
    if (query && query.trim() !== "") {
      const searchLower = query.toLowerCase().trim();
      filteredData = filteredData.filter(user => 
        (user.name && user.name.toLowerCase().includes(searchLower)) || 
        (user.phone && user.phone.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower))
      );
    }
    
    // Then apply other filters
    if (filterOptions.gender && filterOptions.gender !== "") {
      filteredData = filteredData.filter(user => 
        user.gender && user.gender.toLowerCase() === filterOptions.gender.toLowerCase()
      );
    }
    
    if (filterOptions.role && filterOptions.role !== "") {
      filteredData = filteredData.filter(user => 
        user.role && user.role.toLowerCase() === filterOptions.role.toLowerCase()
      );
    }
    
    // Apply sorting
    if (filterOptions.sortBy && filterOptions.sortBy !== "") {
      switch(filterOptions.sortBy) {
        case 'nameAsc':
          filteredData.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
          break;
        case 'nameDesc':
          filteredData.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
          break;
        case 'dateNewest':
          filteredData.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
        case 'dateOldest':
          filteredData.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
          break;
        default:
          break;
      }
    }
    
    // Update total count for pagination
    setTotalItems(filteredData.length);
    
    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    
    // Update rows
    setRows(paginatedData);
    
    // Reset to first page if no results on current page
    if (paginatedData.length === 0 && currentPage > 1) {
      setCurrentPage(1);
    }
  };

  const singleuser=(id)=>{
    navigate(`/userprofile/${id}`)
  }
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Searching for:", searchQuery);
    setCurrentPage(1); // Reset to first page when searching
    applyFiltersAndPagination(allUsers, searchQuery, filters);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // When page changes, we just need to reapply pagination with existing filters
    applyFiltersAndPagination(allUsers, searchQuery, filters);
  };
  
  const handleFilterChange = (filterName, value) => {
    const updatedFilters = { ...filters, [filterName]: value };
    setFilters(updatedFilters);
  };
  
  const applyFilters = () => {
    console.log("Applying filters:", filters);
    setCurrentPage(1); // Reset to first page when filters change
    applyFiltersAndPagination(allUsers, searchQuery, filters);
  };
  
  const resetFilters = () => {
    const resetFiltersObj = {
      gender: "",
      role: "",
      sortBy: ""
    };
    setFilters(resetFiltersObj);
    setCurrentPage(1);
    applyFiltersAndPagination(allUsers, searchQuery, resetFiltersObj);
  };

  // Effect for initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Effect to handle pagination changes
  useEffect(() => {
    if (allUsers.length > 0) {
      applyFiltersAndPagination(allUsers, searchQuery, filters);
    }
  }, [currentPage, itemsPerPage]);

  // Calculate the total number of pages
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Generate pagination items
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item 
        key={i} 
        active={i === currentPage}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <div className="usermanage">
      <p className="Product-heading">User Management</p>
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
              placeholder="Search by name, email or phone"
              className="user-search-input"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button 
              type="submit" 
              variant="primary" 
              className="ms-2"
            >
              Search
            </Button>
          </Form>
        </Col>
        <Col md={2} className="d-flex justify-content-end">
          <button 
            className="w-100 user-filter-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter
            <span className="ms-3">
              <IoFilter />
            </span>
          </button>
        </Col>
      </Row>

      {/* Filter Panel */}
      {showFilters && (
        <Row className="mt-3 filter-panel p-3">
          {/* <Col md={3}>
            <Form.Group>
              <Form.Label>Gender</Form.Label>
              <Form.Select 
                value={filters.gender} 
                onChange={(e) => handleFilterChange('gender', e.target.value)}
              >
                <option value="">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col> */}
          <Col md={3}>
            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Select 
                value={filters.role} 
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <option value="">All</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Sort By</Form.Label>
              <Form.Select 
                value={filters.sortBy} 
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="">Default</option>
                <option value="nameAsc">Name (A-Z)</option>
                <option value="nameDesc">Name (Z-A)</option>
                <option value="dateNewest">Newest First</option>
                <option value="dateOldest">Oldest First</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Button 
              variant="outline-secondary" 
              className="me-2"
              onClick={resetFilters}
            >
              Reset
            </Button>
            <Button 
              variant="primary"
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </Col>
        </Row>
      )}

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
          <div className="text-center">No users found matching your criteria.</div>
        ) : (
          <>
            <TableContainer component={Paper} className="Dproduct">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="dproduct-tablehead" width="5%">SI No</TableCell>
                    <TableCell className="dproduct-tablehead">Name</TableCell>
                    <TableCell className="dproduct-tablehead" align="left">
                      Email
                    </TableCell>
                    <TableCell className="dproduct-tablehead" align="left">
                      Mobile Number
                    </TableCell>
                    {/* <TableCell className="dproduct-tablehead" align="left">
                      Gender
                    </TableCell> */}
                    <TableCell className="dproduct-tablehead" align="left">
                      Role
                    </TableCell>
                    <TableCell className="dproduct-tablehead" align="left">
                      Referral Code
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                   <TableRow key={row._id || index} hover>
  <TableCell align="left" className="dorder-tabledata">
    {(currentPage - 1) * itemsPerPage + index + 1}
  </TableCell>

  <TableCell
    align="left"
    className="dorder-tabledata"
    style={{ cursor: 'pointer', color: '#007bff' }}
    onClick={() => singleuser(row._id)}
  >
    {row.name || 'N/A'}
  </TableCell>

  <TableCell align="left" className="dorder-tabledata">
    {row.email || 'N/A'}
  </TableCell>

  <TableCell align="left" className="dorder-tabledata">
    {row.phone || 'N/A'}
  </TableCell>

  {/* <TableCell align="left" className="dorder-tabledata">
    {row.gender || 'N/A'}
  </TableCell> */}

  <TableCell align="left" className="dorder-tabledata">
    {row.role || 'N/A'}
  </TableCell>

  <TableCell align="left" className="dorder-tabledata">
    {row.referralCode || 'N/A'}
  </TableCell>
</TableRow>

                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination controls */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div>
                Showing {rows.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
              </div>
              <div>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="me-2 mb-0">Items per page:</Form.Label>
                  <Form.Select 
                    size="sm" 
                    style={{ width: "80px" }}
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page when changing items per page
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </Form.Select>
                </Form.Group>
              </div>
              {totalPages > 0 && (
                <Pagination>
                  <Pagination.First 
                    onClick={() => handlePageChange(1)} 
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {paginationItems}
                  <Pagination.Next 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last 
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              )}
            </div>
          </>
        )}
      </Row>
    </div>
  );
}

export default UserManage;