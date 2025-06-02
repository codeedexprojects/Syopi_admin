import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import Home from './Pages/Home';
import Products from './Pages/Products';
import Flagged from './Pages/Flagged';
import Productreview from './Pages/Productreview';
import SingleProduct from './Pages/SingleProduct';
import UserDetails from './Pages/UserDetails';
import Orders from './Pages/Orders';
import UserManage from './Pages/UserManage';
import Offer from './Pages/Offer';
import Coupon from './Pages/Coupon';
import Notification from './Pages/Notification';
import Carousel from './Pages/Carousel';
import Category from './Pages/Category';
import Subcategory from './Pages/Subcategory';
import Managevendors from './Pages/Managevendors';
import VendorProfile from './Pages/VendorProfile';
import Shopdetails from './Pages/Shopdetails';
import AdminLogin from './Pages/AdminLogin';
import Addproduct from './Pages/Addproduct';
import Addvendors from './Pages/Addvendor';
import SubcategoriesbyCategoryId from './Pages/SubcategoriesbyCategoryId';
import VendorDashboard from './Pages/Vendor/VendorDashboard';
import VendorCategory from './Pages/Vendor/VendorCategory';
import VendorSubcategory from './Pages/Vendor/VendorSubcategory';
import CategoryCarousel from './Pages/CategoryCarousel'

import ProtectedRoute from './Components/ProtectedRoute';
import Vendorsubcategorybyid from './Pages/Vendor/Vendorsubcategorybyid';
import Vendornotification from './Pages/Vendor/Vendornotification';
import VendorSlider from './Pages/Vendor/VendorSlider';
import VendorOffer from './Pages/Vendor/VendorOffer';
import VendorCoupon from './Pages/Vendor/VendorCoupon';
import VendorProduct from './Pages/Vendor/VendorProduct';
import VendorAddProduct from './Pages/Vendor/VendorAddProduct';
import VendorSingleProduct from './Pages/Vendor/VendorSingleProduct';
import { setOnTokenExpired } from './services/commonApi';
import TokenExpiredModal from './Components/TokenExpiredModal';
import Brand from './Pages/Brand';
import VendorOrder from './Pages/Vendor/VendorOrder';
import Homepage from './Pages/Homepage';
import Coin from './Pages/Coin';
import BrandCarousel from './Pages/BrandCarousel';
import VendorLogin from './Pages/Vendor/VendorLogin';
import UserProfile from './Pages/UserProfile';
import VendorPayout from './Pages/VendorPayout';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showTokenModal, setShowTokenModal] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    // Redirect to login if no token
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      const role = localStorage.getItem('role');
      
      // If on the root path and authenticated, redirect to appropriate dashboard
      if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
        if (token && role === 'admin') {
          window.location.href = '/admin/admindashboard';
        } else if (token && role === 'vendor') {
          window.location.href = '/admin/vendordashboard';
        }
      }
    };
    
    checkAuth();
  }, []);

  // Set the callback function when the app loads
  setOnTokenExpired(() => {
    setShowTokenModal(true);
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderLayout = (Component) => (
    <>
      <Sidebar isOpen={isSidebarOpen} />
      <div className="content flex-grow-1">
        <Header toggleSidebar={toggleSidebar} />
        <Component />
      </div>
    </>
  );

  // Get user role
  const userRole = localStorage.getItem('role');

  return (
    <div className={`App d-flex ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/vendorlogin" element={<VendorLogin />} />

        {/* Root path redirects to appropriate dashboard or login */}
        <Route path="/" element={
          localStorage.getItem('accessToken') 
            ? (userRole === 'admin' 
                ? <Navigate to="/admindashboard" /> 
                : <Navigate to="/vendordashboard" />)
            : <Navigate to="/login" />
        } />

        {/* Admin routes */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute role="admin">
              {renderLayout(Home)}
            </ProtectedRoute>
          }
        />
                <Route path="/homepage" element={<ProtectedRoute role="admin">{renderLayout(Homepage)}</ProtectedRoute>} />
                <Route path="/userprofile/:id" element={<ProtectedRoute role="admin">{renderLayout(UserProfile)}</ProtectedRoute>} />

                <Route path="/coin" element={<ProtectedRoute role="admin">{renderLayout(Coin)}</ProtectedRoute>} />
                <Route path="/categorycarousal" element={<ProtectedRoute role="admin">{renderLayout(CategoryCarousel)}</ProtectedRoute>} />
                <Route path="/brandcarousal" element={<ProtectedRoute role="admin">{renderLayout(BrandCarousel)}</ProtectedRoute>} />

        <Route path="/products" element={<ProtectedRoute role="admin">{renderLayout(Products)}</ProtectedRoute>} />
        <Route path="/flagged" element={<ProtectedRoute role="admin">{renderLayout(Flagged)}</ProtectedRoute>} />
        <Route path="/review" element={<ProtectedRoute role="admin">{renderLayout(Productreview)}</ProtectedRoute>} />
        <Route path="/singleproduct/:id" element={<ProtectedRoute role="admin">{renderLayout(SingleProduct)}</ProtectedRoute>} />
        <Route path="/addproduct" element={<ProtectedRoute role="admin">{renderLayout(Addproduct)}</ProtectedRoute>} />
        <Route path="/userdetails" element={<ProtectedRoute role="admin">{renderLayout(UserDetails)}</ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute role="admin">{renderLayout(Orders)}</ProtectedRoute>} />
        <Route path="/brand" element={<ProtectedRoute role="admin">{renderLayout(Brand)}</ProtectedRoute>} />
        <Route path="/usermanage" element={<ProtectedRoute role="admin">{renderLayout(UserManage)}</ProtectedRoute>} />
        <Route path="/offer" element={<ProtectedRoute role="admin">{renderLayout(Offer)}</ProtectedRoute>} />
        <Route path="/coupon" element={<ProtectedRoute role="admin">{renderLayout(Coupon)}</ProtectedRoute>} />
        <Route path="/notification" element={<ProtectedRoute role="admin">{renderLayout(Notification)}</ProtectedRoute>} />
        <Route path="/carousel" element={<ProtectedRoute role="admin">{renderLayout(Carousel)}</ProtectedRoute>} />
        <Route path="/category" element={<ProtectedRoute role="admin">{renderLayout(Category)}</ProtectedRoute>} />
        <Route path="/subcategory" element={<ProtectedRoute role="admin">{renderLayout(Subcategory)}</ProtectedRoute>} />
        <Route path="/subcategorybyid/:categoryid" element={<ProtectedRoute role="admin">{renderLayout(SubcategoriesbyCategoryId)}</ProtectedRoute>} />
        <Route path="/managevendors" element={<ProtectedRoute role="admin">{renderLayout(Managevendors)}</ProtectedRoute>} />
        <Route path="/vendorprofile/:id" element={<ProtectedRoute role="admin">{renderLayout(VendorProfile)}</ProtectedRoute>} />
        <Route path="/shopdetails" element={<ProtectedRoute role="admin">{renderLayout(Shopdetails)}</ProtectedRoute>} />
        <Route path="/addvendor" element={<ProtectedRoute role="admin">{renderLayout(Addvendors)}</ProtectedRoute>} />
        <Route path="/vendorpayout" element={<ProtectedRoute role="admin">{renderLayout(VendorPayout)}</ProtectedRoute>} />

        {/* Vendor routes */}
        <Route path="/vendordashboard" element={<ProtectedRoute role="vendor">{renderLayout(VendorDashboard)}</ProtectedRoute>} />
        <Route path="/vendorcategory" element={<ProtectedRoute role="vendor">{renderLayout(VendorCategory)}</ProtectedRoute>} />
        <Route path="/vendorsubcategory" element={<ProtectedRoute role="vendor">{renderLayout(VendorSubcategory)}</ProtectedRoute>} />
        <Route path="/vendorsubcategorybyid/:categoryid" element={<ProtectedRoute role="vendor">{renderLayout(Vendorsubcategorybyid)}</ProtectedRoute>} />
        <Route path="/vendornotification" element={<ProtectedRoute role="vendor">{renderLayout(Vendornotification)}</ProtectedRoute>} />
        <Route path="/vendorslider" element={<ProtectedRoute role="vendor">{renderLayout(VendorSlider)}</ProtectedRoute>} />
        <Route path="/vendoroffer" element={<ProtectedRoute role="vendor">{renderLayout(VendorOffer)}</ProtectedRoute>} />
        <Route path="/vendorcoupon" element={<ProtectedRoute role="vendor">{renderLayout(VendorCoupon)}</ProtectedRoute>} />
        <Route path="/vendorproducts" element={<ProtectedRoute role="vendor">{renderLayout(VendorProduct)}</ProtectedRoute>} />
        <Route path="/addvendorproducts" element={<ProtectedRoute role="vendor">{renderLayout(VendorAddProduct)}</ProtectedRoute>} />
        <Route path="/singlevendorproduct/:id" element={<ProtectedRoute role="vendor">{renderLayout(VendorSingleProduct)}</ProtectedRoute>} />
        <Route path="/vendororders" element={<ProtectedRoute role="vendor">{renderLayout(VendorOrder)}</ProtectedRoute>} />
        
        {/* Catch-all route for 404s - redirect to login or dashboard */}
        <Route path="*" element={
          localStorage.getItem('accessToken') 
            ? (userRole === 'admin' 
                ? <Navigate to="/admindashboard" /> 
                : <Navigate to="/vendordashboard" />)
            : <Navigate to="/login" />
        } />
      </Routes>
      <TokenExpiredModal show={showTokenModal} onHide={() => setShowTokenModal(false)} />
    </div>
  );
}

export default App;