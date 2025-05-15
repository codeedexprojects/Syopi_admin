import React from 'react';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import './usercart.css';

function UserCart() {
  const cartData = {
    "_id": "68037ab7351d0962639082ee",
    "userId": "67d94558f6a574bb7ebb5200",
    "items": [
      {
        "productId": {
          "_id": "68034833351d096263904ffe",
          "name": "CB-COLEBROOK Regular Fit Shirt For Men",
          "images": [
            "image-1745045555113-51dR5N2fe6L.jpg",
            "image-1745045555113-51X2oqg++RL.jpg",
            "image-1745045555114-51X6L3euv5L.jpg"
          ]
        },
        "quantity": 1,
        "color": "#ffffff",
        "size": "S",
        "colorName": "White",
        "_id": "68037ab7351d0962639082ef",
        "price": 229.5
      },
      {
        "productId": {
          "_id": "68034833351d096263904ffe",
          "name": "CB-COLEBROOK Regular Fit Shirt For Men",
          "images": [
            "image-1745045555113-51dR5N2fe6L.jpg",
            "image-1745045555113-51X2oqg++RL.jpg",
            "image-1745045555114-51X6L3euv5L.jpg"
          ]
        },
        "quantity": 1,
        "color": "#ffffff",
        "size": "XXL",
        "colorName": "White",
        "_id": "68038dd0351d09626390ae08",
        "price": 229.5
      }
    ],
    "subtotal": 459,
    "discount": 0,
    "totalPrice": 459,
    "createdAt": "2025-04-19T10:28:07.876Z",
    "updatedAt": "2025-04-19T11:49:36.525Z",
    "__v": 1
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

  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };

  return (
    <div className="user-cart-container">
      <div className="user-cart-header">
        <div>
          <h1 className="user-cart-title">Shopping Cart</h1>
          <span className="user-cart-id">Cart ID: {cartData._id.substring(cartData._id.length - 8)}</span>
        </div>
        <div className="user-cart-date">
          Last updated: {formatDate(cartData.updatedAt)}
        </div>
      </div>

      <div className="user-cart-content">
        <div className="user-cart-items">
          <div className="user-cart-items-header">
            <ShoppingCart className="user-cart-items-icon" size={18} />
            <span>Cart Items</span>
            <span className="user-cart-items-count">{cartData.items.length}</span>
          </div>

          {cartData.items.length > 0 ? (
            cartData.items.map((item) => (
              <div key={item._id} className="user-cart-item">
                <div className="user-cart-item-image-container">
                  <img 
                    src={`/api/placeholder/80/80`} 
                    alt={item.productId.name}
                    className="user-cart-item-image"
                  />
                </div>

                <div className="user-cart-item-details">
                  <div>
                    <h3 className="user-cart-item-name">{item.productId.name}</h3>
                    <div className="user-cart-item-attributes">
                      <div className="user-cart-item-attribute">
                        <span className="user-cart-color-dot" style={{ backgroundColor: item.color }}></span>
                        Color: {item.colorName}
                      </div>
                      <div className="user-cart-item-attribute">
                        Size: {item.size}
                      </div>
                    </div>
                  </div>

                  <div className="user-cart-item-quantity-price">
                    <div className="user-cart-item-quantity">
                      Qty: {item.quantity}
                    </div>
                    <div className="user-cart-item-price">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="user-cart-empty">
              <ShoppingBag size={48} className="user-cart-empty-icon" />
              <p>Your cart is empty.</p>
            </div>
          )}
        </div>

        <div className="user-cart-summary">
          <div className="user-cart-summary-header">Order Summary</div>
          <div className="user-cart-summary-content">
            <div className="user-cart-summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(cartData.subtotal)}</span>
            </div>
            <div className="user-cart-summary-row">
              <span>Discount</span>
              <span>{formatPrice(cartData.discount)}</span>
            </div>
            <div className="user-cart-summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="user-cart-total-row">
              <span>Total</span>
              <span>{formatPrice(cartData.totalPrice)}</span>
            </div>

            {/* <div className="user-cart-actions">
              <button className="user-cart-action-button user-cart-checkout-button">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={18} style={{ marginRight: '0.5rem' }} />
                  Proceed to Checkout
                </div>
              </button>
              <button className="user-cart-action-button user-cart-continue-button">
                Continue Shopping
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCart;