import React from 'react';
import { Heart, Tag } from 'lucide-react';
import { BASE_URL } from '../services/baseUrl';
import './userwishlist.css';

const AdminWishlistItem = ({ wishlist }) => {
  console.log("wishlist", wishlist);
  
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

  const calculateDiscount = (price, offerPrice) => {
    return Math.round(((price - offerPrice) / price) * 100);
  };

  if (!Array.isArray(wishlist) || wishlist.length === 0) {
    return <div className="admin-wishlist-empty">No wishlist items found</div>;
  }

  return (
    <div className="admin-wishlist-container">
      {wishlist.map((item) => {
        const product = item.productId;
        const mainVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
        const discountPercentage = mainVariant ? calculateDiscount(mainVariant.price, mainVariant.offerPrice) : 0;
        
        return (
          <div className="admin-wishlist-card" key={item._id}>
            <div className="admin-wishlist-header">
              <div className="admin-wishlist-title">
                <Heart className="admin-wishlist-title-icon" size={20} />
                <span>Wishlist Item #{item._id}</span>
              </div>
              <div className="admin-wishlist-meta">
                <span className={`admin-wishlist-status ${product.status === "pending" ? "admin-wishlist-status-pending" : "admin-wishlist-status-active"}`}>
                  {product.status === "pending" ? "Pending" : "Active"}
                </span>
                <span className="admin-wishlist-date">
                  Added: {formatDate(item.createdAt)}
                </span>
              </div>
            </div>
            
            <div className="admin-wishlist-body">
              <div className="admin-wishlist-image-container">
                <img 
                  src={product.images && product.images.length > 0 
                    ? `${BASE_URL}/uploads/${product.images[0]}`
                    : "/api/placeholder/300/400"}
                  alt={product.name}
                  className="admin-wishlist-image"
                />
                {mainVariant && discountPercentage > 0 && (
                  <span className="admin-wishlist-discount-badge">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
              
              <div className="admin-wishlist-details">
                <h5 className="admin-wishlist-product-name">{product.name}</h5>
                <div className="admin-wishlist-product-badges">
                  <span className="admin-wishlist-badge">
                    {product.productType}
                  </span>
                  <span className="admin-wishlist-badge">
                    Code: {product.productCode}
                  </span>
                </div>
                
                <p className="admin-wishlist-description">{product.description}</p>
                
                {mainVariant && (
                  <div className="admin-wishlist-variants">
                    <div className="admin-wishlist-variants-header">
                      <Tag size={16} className="admin-wishlist-variants-icon" />
                      <strong className="admin-wishlist-variants-title">Variants:</strong>
                    </div>
                    <div className="admin-wishlist-variants-list">
                      {product.variants.map((variant, index) => (
                        <span key={index} className="admin-wishlist-variant-item">
                          <span 
                            className="admin-wishlist-color-dot" 
                            style={{ backgroundColor: variant.colorName ? variant.colorName.toLowerCase() : '#ccc' }}
                          ></span>
                          {variant.colorName}: ₹{variant.offerPrice} 
                          <span className="admin-wishlist-original-price">₹{variant.price}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="admin-wishlist-inventory">
                  <div className="admin-wishlist-inventory-item">
                    <span className="admin-wishlist-inventory-label">Stock: </span>
                    <span className={`admin-wishlist-stock ${product.totalStock > 0 ? "admin-wishlist-stock-available" : "admin-wishlist-stock-out"}`}>
                      {product.totalStock}
                    </span>
                  </div>
                  <div className="admin-wishlist-inventory-item">
                    <span className="admin-wishlist-inventory-label">Sales: </span>
                    <span className="admin-wishlist-sales">
                      {product.totalSales}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="admin-wishlist-user-section">
                <h6 className="admin-wishlist-user-title">User Information</h6>
                <p className="admin-wishlist-user-info">
                  <span className="admin-wishlist-user-label">User ID:</span><br/>
                  <span className="admin-wishlist-user-value">{item.userId.substring(0, 10)}...</span>
                </p>
                
                <div className="admin-wishlist-actions">
                  <button className="admin-wishlist-action-button admin-wishlist-view-button">
                    View Product Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminWishlistItem;