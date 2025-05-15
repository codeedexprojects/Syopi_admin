import React from 'react';
import { Heart, Tag } from 'lucide-react';
import { BASE_URL } from '../services/baseUrl';
import './userwishlist.css';

const AdminWishlistItem = () => {
  const wishlistItem = {
    _id: "681b46a40c858a4c2a0d1182",
    userId: "6819d1d50c858a4c2a0ac06d",
    createdAt: "2025-05-07T11:40:20.323Z",
    product: {
      _id: "68088963b5b50411e1cb8e07",
      name: "Symbol Regular Fit Full Sleeve Shirt For Men",
      productType: "Dress",
      productCode: "D-AD-015",
      images: [
        `${BASE_URL}/uploads/image-1745389923265-men.jpg`,
        `${BASE_URL}/uploads/image-1745389923267-kids.jpg`,
        `${BASE_URL}/uploads/image-1745389923268-all sports.jpg`
      ],
      brand: "67e0f950d5183fe70b81075a",
      brandName: "Symbol",
      description: "Premium cotton casual shirts, perfect for all occasions.",
      variants: [
        {
          colorName: "Brown",
          price: 700,
          offerPrice: 301,
        },
        {
          colorName: "Crimson Red",
          price: 750,
          offerPrice: 351,
        }
      ],
      totalStock: 70,
      totalSales: 0,
      status: "pending"
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate discount percentage
  const calculateDiscount = (price, offerPrice) => {
    return Math.round(((price - offerPrice) / price) * 100);
  };

  // Get the main variant (first one)
  const mainVariant = wishlistItem.product.variants[0];
  const discountPercentage = calculateDiscount(mainVariant.price, mainVariant.offerPrice);

  return (
    <div className="admin-wishlist-container">
      <div className="admin-wishlist-card">
        {/* Card Header */}
        <div className="admin-wishlist-header">
          <div className="admin-wishlist-title">
            <Heart className="admin-wishlist-title-icon" size={20} />
            <span>Wishlist Item #{wishlistItem._id.substring(wishlistItem._id.length - 6)}</span>
          </div>
          <div className="admin-wishlist-meta">
            <span className={`admin-wishlist-status ${wishlistItem.product.status === "pending" ? "admin-wishlist-status-pending" : "admin-wishlist-status-active"}`}>
              {wishlistItem.product.status === "pending" ? "Pending" : "Active"}
            </span>
            <span className="admin-wishlist-date">
              Added: {formatDate(wishlistItem.createdAt)}
            </span>
          </div>
        </div>
        
        {/* Card Body */}
        <div className="admin-wishlist-body">
          {/* Product Image */}
          <div className="admin-wishlist-image-container">
            <img 
              src="/api/placeholder/300/400"                 
              alt={wishlistItem.product.name}
              className="admin-wishlist-image"
            />
            {discountPercentage > 0 && (
              <span className="admin-wishlist-discount-badge">
                {discountPercentage}% OFF
              </span>
            )}
          </div>
          
          {/* Product Details */}
          <div className="admin-wishlist-details">
            <h5 className="admin-wishlist-product-name">{wishlistItem.product.name}</h5>
            <div className="admin-wishlist-product-badges">
              <span className="admin-wishlist-badge">
                {wishlistItem.product.productType}
              </span>
              <span className="admin-wishlist-badge">
                Code: {wishlistItem.product.productCode}
              </span>
            </div>
            
            <p className="admin-wishlist-description">{wishlistItem.product.description}</p>
            
            <div className="admin-wishlist-variants">
              <div className="admin-wishlist-variants-header">
                <Tag size={16} className="admin-wishlist-variants-icon" />
                <strong className="admin-wishlist-variants-title">Variants:</strong>
              </div>
              <div className="admin-wishlist-variants-list">
                {wishlistItem.product.variants.map((variant, index) => (
                  <span key={index} className="admin-wishlist-variant-item">
                    <span 
                      className="admin-wishlist-color-dot" 
                      style={{ backgroundColor: variant.colorName.toLowerCase() }}
                    ></span>
                    {variant.colorName}: ₹{variant.offerPrice} 
                    <span className="admin-wishlist-original-price">₹{variant.price}</span>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="admin-wishlist-inventory">
              <div className="admin-wishlist-inventory-item">
                <span className="admin-wishlist-inventory-label">Stock: </span>
                <span className={`admin-wishlist-stock ${wishlistItem.product.totalStock > 0 ? "admin-wishlist-stock-available" : "admin-wishlist-stock-out"}`}>
                  {wishlistItem.product.totalStock}
                </span>
              </div>
              <div className="admin-wishlist-inventory-item">
                <span className="admin-wishlist-inventory-label">Sales: </span>
                <span className="admin-wishlist-sales">
                  {wishlistItem.product.totalSales}
                </span>
              </div>
            </div>
          </div>
          
          {/* User Info and Actions */}
          <div className="admin-wishlist-user-section">
            <h6 className="admin-wishlist-user-title">User Information</h6>
            <p className="admin-wishlist-user-info">
              <span className="admin-wishlist-user-label">User ID:</span><br/>
              <span className="admin-wishlist-user-value">{wishlistItem.userId.substring(0, 10)}...</span>
            </p>
            
            <div className="admin-wishlist-actions">
              <button className="admin-wishlist-action-button admin-wishlist-view-button">
                View Product Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWishlistItem;