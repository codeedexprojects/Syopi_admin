import React from "react";
import {
  FaTachometerAlt,
  FaBox,
  FaTags,
  FaListAlt,
  FaShoppingCart,
  FaGift,
  FaBell,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ isOpen }) {
  const location = useLocation();
  const userRole = localStorage.getItem("role");

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul className="sidebar-content">
        {userRole === "admin" && (
          <>
            <Link to="/admindashboard" style={{ textDecoration: "none" }}>
              <li className={isActive("/admindashboard") ? "active" : ""}>
                <FaTachometerAlt className="icon" /> Dashboard
              </li>
            </Link>
            <Link to="/usermanage" style={{ textDecoration: "none" }}>
              <li className={isActive("/usermanage") ? "active" : ""}>
                <FaTags className="icon" /> Manage Users
              </li>
            </Link>
            <Link to="/managevendors" style={{ textDecoration: "none" }}>
              <li className={isActive("/managevendors") ? "active" : ""}>
                <FaBox className="icon" /> Manage Vendors
              </li>
            </Link>
            <Link to="/products" style={{ textDecoration: "none" }}>
              <li className={isActive("/products") ? "active" : ""}>
                <FaBox className="icon" /> Manage Products
              </li>
            </Link>
            <Link to="/orders" style={{ textDecoration: "none" }}>
              <li className={isActive("/orders") ? "active" : ""}>
                <FaShoppingCart className="icon" /> Orders
              </li>
            </Link>
            <Link to="/brand" style={{ textDecoration: "none" }}>
              <li className={isActive("/brand") ? "active" : ""}>
                <FaTags className="icon" /> Brands
              </li>
            </Link>
            <Link to="/category" style={{ textDecoration: "none" }}>
              <li className={isActive("/category") ? "active" : ""}>
                <FaTags className="icon" /> Category
              </li>
            </Link>
            <Link to="/subcategory" style={{ textDecoration: "none" }}>
              <li className={isActive("/subcategory") ? "active" : ""}>
                <FaListAlt className="icon" /> Subcategory
              </li>
            </Link>
           
            <Link to="/homepage" style={{ textDecoration: "none" }}>
              <li className={isActive("/homepage") ? "active" : ""}>
                <FaBox className="icon" /> Manage Homepage
              </li>
            </Link>
            <Link to="/coupon" style={{ textDecoration: "none" }}>
              <li className={isActive("/coupon") ? "active" : ""}>
                <FaGift className="icon" /> Coupons
              </li>
            </Link>
            <Link to="/offer" style={{ textDecoration: "none" }}>
              <li className={isActive("/offer") ? "active" : ""}>
                <FaTags className="icon" /> Offers
              </li>
            </Link>
            <Link to="/coin" style={{ textDecoration: "none" }}>
              <li className={isActive("/coin") ? "active" : ""}>
                <FaBox className="icon" /> Coin
              </li>
            </Link>
            <Link to="/notification" style={{ textDecoration: "none" }}>
              <li className={isActive("/notification") ? "active" : ""}>
                <FaBell className="icon" /> Notifications
              </li>
            </Link>
          </>
        )}

        {userRole === "vendor" && (
          <>
            <Link to="/vendordashboard" style={{ textDecoration: "none" }}>
              <li className={isActive("/vendordashboard") ? "active" : ""}>
                <FaTachometerAlt className="icon" /> Dashboard
              </li>
            </Link>

            <Link to="/vendorcategory" style={{ textDecoration: "none" }}>
              <li className={isActive("/vendorcategory") ? "active" : ""}>
                <FaTags className="icon" /> Category
              </li>
            </Link>
            <Link to="/vendorsubcategory" style={{ textDecoration: "none" }}>
              <li className={isActive("/vendorsubcategory") ? "active" : ""}>
                <FaListAlt className="icon" /> Subcategory
              </li>
            </Link>
            <Link to="/vendornotification" style={{ textDecoration: "none" }}>
              <li className={isActive("/vendornotification") ? "active" : ""}>
                <FaListAlt className="icon" /> Notification
              </li>
            </Link>
            <Link to="/vendororders" style={{ textDecoration: "none" }}>
              <li className={isActive("/vendororders") ? "active" : ""}>
                <FaShoppingCart className="icon" /> Orders
              </li>
            </Link>
            <Link to="/vendorslider" style={{ textDecoration: "none" }}>
              <li className={isActive("/vendorslider") ? "active" : ""}>
                <FaListAlt className="icon" /> Slider
              </li>
            </Link>
            <Link to="/vendoroffer" style={{ textDecoration: "none" }}>
              <li className={isActive("/vendoroffer") ? "active" : ""}>
                <FaListAlt className="icon" /> Offer
              </li>
            </Link>
            <Link to="/vendorcoupon" style={{ textDecoration: "none" }}>
              <li className={isActive("/vendorcoupon") ? "active" : ""}>
                <FaListAlt className="icon" /> Coupon
              </li>
            </Link>

            <Link to="/vendorproducts" style={{ textDecoration: "none" }}>
              <li className={isActive("/vendorproducts") ? "active" : ""}>
                <FaBox className="icon" /> Manage Products
              </li>
            </Link>
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
