import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState({ items: [], totalItems: 0, subtotal: 0 });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const refreshCart = async () => {
    if (!token) {
      setCart({ items: [], totalItems: 0, subtotal: 0 });
      return;
    }
    try {
      setLoading(true);
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      console.warn('Could not fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [token]);

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      throw new Error('Please sign in to add items to your cart');
    }
    try {
      const updated = await cartApi.addItem(productId, quantity);
      setCart(updated);
      showNotification('Item added to cart');
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!token) return;
    try {
      const updated = await cartApi.updateItem(productId, quantity);
      setCart(updated);
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    if (!token) return;
    try {
      const updated = await cartApi.removeItem(productId);
      setCart(updated);
      showNotification('Item removed from cart');
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const clearCart = async () => {
    if (!token) return;
    try {
      await cartApi.clearCart();
      setCart({ items: [], totalItems: 0, subtotal: 0 });
    } catch (err) {
      console.warn('Failed to clear cart:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart.items || [],
        totalItems: cart.totalItems || 0,
        subtotal: cart.subtotal || 0,
        loading,
        notification,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
