import React, {  useState } from 'react';
import { Route, Routes } from 'react-router-dom';
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

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);

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

  return (
    <div className={`App d-flex ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route
    path="/"
    element={
      <ProtectedRoute role="admin">
        {renderLayout(Home)}
      </ProtectedRoute>
    }
  />        <Route path="/products" element={<ProtectedRoute role="admin">{renderLayout(Products)}</ProtectedRoute>} />
        <Route path="/flagged" element={<ProtectedRoute role="admin">{renderLayout(Flagged)}</ProtectedRoute>} />
        <Route path="/review" element={<ProtectedRoute role="admin">{renderLayout(Productreview)}</ProtectedRoute>} />
        <Route path="/singleproduct/:id" element={<ProtectedRoute role="admin">{renderLayout(SingleProduct)}</ProtectedRoute>} />
        <Route path="/addproduct" element={<ProtectedRoute role="admin">{renderLayout(Addproduct)}</ProtectedRoute>} />
        <Route path="/userdetails" element={<ProtectedRoute role="admin">{renderLayout(UserDetails)}</ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute role="admin">{renderLayout(Orders)}</ProtectedRoute>} />
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


        
        
      </Routes>
      <TokenExpiredModal show={showTokenModal} onHide={() => setShowTokenModal(false)} />

    </div>
  );
}

export default App;
