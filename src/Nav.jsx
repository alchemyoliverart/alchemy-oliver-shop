import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from './CartContext.jsx';

function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname.startsWith('/print/') || location.pathname === '/contact';
  const { items, removeItem, total, count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setCheckingOut(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            title: item.title,
            size: item.size,
            amount: item.price,
            imageUrl: window.location.origin + item.image,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setCheckingOut(false);
    }
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        {showBack && (
          <button
            className="nav-back"
            onClick={() => navigate('/', { state: { direction: 'back' } })}
          >
            ←
          </button>
        )}
        <span className="nav-label">Alchemy_oliver</span>
      </div>
      <div className="nav-center">
        <Link to="/contact" className="nav-contact">contact</Link>
      </div>
      <div className="nav-right">
        <a href="https://instagram.com/alchemyoliver" target="_blank" rel="noopener noreferrer" className="nav-contact">instagram</a>
        <div
          className="nav-cart-wrapper"
          onMouseEnter={() => setCartOpen(true)}
          onMouseLeave={() => setCartOpen(false)}
        >
          <button className="nav-contact nav-cart-btn">
            cart{count > 0 ? ` (${count})` : ''}
          </button>
          {cartOpen && (
            <div className="cart-dropdown">
              {items.length === 0 ? (
                <p className="cart-empty">your cart is empty</p>
              ) : (
                <>
                  <div className="cart-items">
                    {items.map(item => (
                      <div key={`${item.id}-${item.size}`} className="cart-item">
                        <img src={item.image} alt={item.title} className="cart-item-thumb" />
                        <div className="cart-item-info">
                          <span className="cart-item-title">{item.title}</span>
                          <span className="cart-item-detail">{item.size} × {item.quantity}</span>
                        </div>
                        <span className="cart-item-price">${item.price * item.quantity}</span>
                        <button
                          className="cart-item-remove"
                          onClick={(e) => { e.stopPropagation(); removeItem(item.id, item.size); }}
                        >×</button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-total">
                    <span>total</span>
                    <span>${total}</span>
                  </div>
                  <button
                    className="dm-button cart-checkout-btn"
                    onClick={handleCheckout}
                    disabled={checkingOut}
                  >
                    {checkingOut ? 'loading...' : 'checkout'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
