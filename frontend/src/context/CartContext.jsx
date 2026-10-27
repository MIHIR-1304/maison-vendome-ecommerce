import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api/cartApi';
import { productApi } from '../api/productApi';
import { useAuth } from './AuthContext';

const GUEST_CART_STORAGE_KEY = 'maison_vendome_guest_cart';

const CartContext = createContext(null);

const getLocalGuestCart = () => {
  try {
    const saved = localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.items)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse guest cart from localStorage:', err);
  }
  return { items: [], totalItems: 0, subtotal: 0 };
};

const saveLocalGuestCart = (cart) => {
  try {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.warn('Failed to save guest cart to localStorage:', err);
  }
};

const recalculateLocalCart = (items) => {
  const totalItems = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0),
    0
  );
  return {
    items,
    totalItems,
    subtotal: Math.round(subtotal * 100) / 100,
  };
};

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState(() => (token ? { items: [], totalItems: 0, subtotal: 0 } : getLocalGuestCart()));
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [recentlyAddedItem, setRecentlyAddedItem] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  // Refresh cart from backend or local storage
  const refreshCart = useCallback(async () => {
    if (!token) {
      const localCart = getLocalGuestCart();
      setCart(localCart);
      return;
    }

    try {
      setLoading(true);
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      console.warn('Could not fetch cart from backend:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Sync guest cart to backend upon login
  useEffect(() => {
    const syncGuestCartToBackend = async () => {
      if (token) {
        const local = getLocalGuestCart();
        if (local.items && local.items.length > 0) {
          try {
            setLoading(true);
            for (const item of local.items) {
              await cartApi.addItem(item.productId, item.quantity).catch(console.warn);
            }
            localStorage.removeItem(GUEST_CART_STORAGE_KEY);
          } catch (syncErr) {
            console.warn('Failed to sync guest cart items to backend:', syncErr);
          }
        }
        await refreshCart();
      } else {
        const local = getLocalGuestCart();
        setCart(local);
      }
    };

    syncGuestCartToBackend();
  }, [token, refreshCart]);

  // Add Item to Cart (Works for BOTH guests and authenticated users)
  const addToCart = async (productId, quantity = 1, productDetails = null) => {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    setLoading(true);

    try {
      if (token) {
        // Authenticated user: call backend cart service
        const updated = await cartApi.addItem(productId, qty);
        setCart(updated);
        
        // Find added item for notification
        const addedItem = updated.items?.find((i) => i.productId === productId);
        setRecentlyAddedItem(addedItem || productDetails || { productId, quantity: qty });
        showNotification(`${productDetails?.name || 'Creation'} added to your shopping bag`);
        openCartDrawer();
        return updated;
      } else {
        // Guest user: store in localStorage
        let product = productDetails;
        if (!product || !product.name || !product.price) {
          try {
            product = await productApi.getProductById(productId);
          } catch (fetchErr) {
            console.warn('Failed to fetch product details for guest cart:', fetchErr);
            product = {
              id: productId,
              name: 'Maison Vendôme Creation',
              price: 0,
              imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
              slug: 'product',
              stockQuantity: 99,
            };
          }
        }

        const currentLocal = getLocalGuestCart();
        const existingIndex = currentLocal.items.findIndex(
          (i) => i.productId === productId || i.productId === Number(productId)
        );

        let newItems = [...currentLocal.items];
        if (existingIndex >= 0) {
          const existing = newItems[existingIndex];
          const newQty = existing.quantity + qty;
          const maxStock = product.stockQuantity || existing.availableStock || 99;
          const finalQty = Math.min(newQty, maxStock);
          newItems[existingIndex] = {
            ...existing,
            quantity: finalQty,
            lineTotal: Math.round(Number(existing.unitPrice) * finalQty * 100) / 100,
          };
        } else {
          const unitPrice = Number(product.price) || 0;
          newItems.push({
            id: Date.now(),
            productId: product.id,
            productName: product.name,
            productSlug: product.slug || '',
            imageUrl: product.imageUrl || '',
            unitPrice: unitPrice,
            quantity: qty,
            availableStock: product.stockQuantity || 99,
            lineTotal: Math.round(unitPrice * qty * 100) / 100,
          });
        }

        const updatedLocal = recalculateLocalCart(newItems);
        saveLocalGuestCart(updatedLocal);
        setCart(updatedLocal);
        setRecentlyAddedItem(product);
        showNotification(`${product.name} added to your shopping bag`);
        openCartDrawer();
        return updatedLocal;
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      showNotification('Could not add item to bag. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Alias for backward compatibility with components calling addItem
  const addItem = addToCart;

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    const qty = parseInt(quantity, 10);

    if (qty <= 0) {
      return removeFromCart(productId);
    }

    try {
      setLoading(true);
      if (token) {
        const updated = await cartApi.updateItem(productId, qty);
        setCart(updated);
        return updated;
      } else {
        const currentLocal = getLocalGuestCart();
        const updatedItems = currentLocal.items.map((item) => {
          if (item.productId === productId || item.productId === Number(productId)) {
            const finalQty = Math.min(qty, item.availableStock || 99);
            return {
              ...item,
              quantity: finalQty,
              lineTotal: Math.round(Number(item.unitPrice) * finalQty * 100) / 100,
            };
          }
          return item;
        });

        const updatedLocal = recalculateLocalCart(updatedItems);
        saveLocalGuestCart(updatedLocal);
        setCart(updatedLocal);
        return updatedLocal;
      }
    } catch (err) {
      console.error('Error updating cart quantity:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      if (token) {
        const updated = await cartApi.removeItem(productId);
        setCart(updated);
        showNotification('Item removed from shopping bag');
        return updated;
      } else {
        const currentLocal = getLocalGuestCart();
        const updatedItems = currentLocal.items.filter(
          (item) => item.productId !== productId && item.productId !== Number(productId)
        );
        const updatedLocal = recalculateLocalCart(updatedItems);
        saveLocalGuestCart(updatedLocal);
        setCart(updatedLocal);
        showNotification('Item removed from shopping bag');
        return updatedLocal;
      }
    } catch (err) {
      console.error('Error removing item from cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear all items
  const clearCart = async () => {
    try {
      setLoading(true);
      if (token) {
        await cartApi.clearCart();
      }
      localStorage.removeItem(GUEST_CART_STORAGE_KEY);
      setCart({ items: [], totalItems: 0, subtotal: 0 });
    } catch (err) {
      console.warn('Failed to clear cart:', err);
    } finally {
      setLoading(false);
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
        addItem,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
        recentlyAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
