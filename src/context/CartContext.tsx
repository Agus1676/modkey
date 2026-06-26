'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, selectedSwitch?: string, selectedLayout?: string) => void;
  removeFromCart: (productId: string, selectedSwitch?: string, selectedLayout?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSwitch?: string, selectedLayout?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('modkey_cart');
      if (stored) {
        try {
          setCartItems(JSON.parse(stored));
        } catch (e) {
          console.error('Error parsing cart from localStorage', e);
        }
      }
      setIsHydrated(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      window.localStorage.setItem('modkey_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isHydrated]);

  const addToCart = (product: Product, quantity: number, selectedSwitch?: string, selectedLayout?: string) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        item.selectedSwitch === selectedSwitch && 
        item.selectedLayout === selectedLayout
      );

      if (existingIndex > -1) {
        const newItems = [...prev];
        const newQty = newItems[existingIndex].quantity + quantity;
        // Limit quantity to available stock
        newItems[existingIndex].quantity = Math.min(newQty, product.stock);
        return newItems;
      }

      return [...prev, { product, quantity: Math.min(quantity, product.stock), selectedSwitch, selectedLayout }];
    });
    setIsCartOpen(true); // Open drawer on addition
  };

  const removeFromCart = (productId: string, selectedSwitch?: string, selectedLayout?: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.product.id === productId && 
        item.selectedSwitch === selectedSwitch && 
        item.selectedLayout === selectedLayout)
    ));
  };

  const updateQuantity = (productId: string, quantity: number, selectedSwitch?: string, selectedLayout?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSwitch, selectedLayout);
      return;
    }

    setCartItems(prev => prev.map(item => {
      if (
        item.product.id === productId && 
        item.selectedSwitch === selectedSwitch && 
        item.selectedLayout === selectedLayout
      ) {
        return { ...item, quantity: Math.min(quantity, item.product.stock) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
