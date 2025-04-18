import { Navbar, Form, FormControl } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { FaBars, FaCog, FaBell, FaUserCircle } from "react-icons/fa";
import "./Header.css";
import { Link } from "react-router-dom";

function Header({ toggleSidebar }) {
  return (
    <Navbar
      expand="lg"
      className=" header-container"
      style={{ backgroundColor: "white" }}
    >
      <div className="d-flex align-items-center">
        <FaBars
          size={24}
          className="me-3 "
          style={{ cursor: "pointer" }}
          onClick={toggleSidebar}
        />
        <Link to="/" style={{ textDecoration: "none" }}>
          <p className="mb-0 header-title ms-5">Overview</p>
        </Link>{" "}
      </div>
      <Form className="d-flex position-relative header-search-container">
        <CiSearch
          size={20}
          className="position-absolute text-muted search-icon"
        />
        <FormControl
          type="search"
          placeholder="Search"
          className="rounded-pill header-search-input"
          aria-label="Search"
        />
      </Form>
      <div className="d-flex align-items-center gap-3 header-icons">
        <div className="icon-wrapper">
          <FaCog style={{ color: "#718EBF" }} size={16} />
        </div>
        <div className="icon-wrapper">
          <FaBell style={{ color: "#FE5C73" }} size={16} />
        </div>
        <div className="icon-wrapper avatar">
          <FaUserCircle size={16} />
        </div>
      </div>
    </Navbar>
  );
}

export default Header;
