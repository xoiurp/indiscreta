'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';
import type { ShopifyCart, CartLineInput } from '@/types/shopify';
import {
  getCart,
  createCart,
  addToCart,
  updateCartLines,
  removeFromCart,
  getStoredCartId,
  setStoredCartId,
  removeStoredCartId,
} from '@/lib/shopify/services';

// Cart state types
interface CartState {
  cart: ShopifyCart | null;
  isLoading: boolean;
  isOpen: boolean;
  error: string | null;
}

// Cart actions
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: ShopifyCart | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' };

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload, isLoading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    default:
      return state;
  }
}

// Cart context type
interface CartContextType extends CartState {
  // Cart actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  refreshCart: () => Promise<void>;
  
  // Cart operations
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Cart helpers
  getItemCount: () => number;
  getSubtotal: () => string;
  isItemInCart: (merchandiseId: string) => boolean;
  getItemQuantity: (merchandiseId: string) => number;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Initial state
const initialState: CartState = {
  cart: null,
  isLoading: false,
  isOpen: false,
  error: null,
};

// Cart provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Initialize cart on mount
  useEffect(() => {
    initializeCart();
  }, []);

  // Initialize cart from localStorage or create new one
  async function initializeCart() {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const storedCartId = getStoredCartId();
      
      if (storedCartId) {
        // Try to fetch existing cart
        const existingCart = await getCart(storedCartId);
        
        if (existingCart) {
          dispatch({ type: 'SET_CART', payload: existingCart });
          return;
        } else {
          // Cart not found, remove invalid ID
          removeStoredCartId();
        }
      }
      
      // Create new cart
      const newCart = await createCart();
      if (newCart) {
        setStoredCartId(newCart.id);
        dispatch({ type: 'SET_CART', payload: newCart });
      }
    } catch (error) {
      console.error('Failed to initialize cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize cart' });
    }
  }

  // Cart UI actions
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });

  // Refresh cart data
  async function refreshCart() {
    if (!state.cart?.id) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await getCart(state.cart.id);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error) {
      console.error('Failed to refresh cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh cart' });
    }
  }

  // Add item to cart
  async function addItem(merchandiseId: string, quantity: number = 1) {
    if (!state.cart?.id) {
      await initializeCart();
      if (!state.cart?.id) return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const lines: CartLineInput[] = [
        {
          merchandiseId,
          quantity,
        },
      ];

      const updatedCart = await addToCart(state.cart.id, lines);
      dispatch({ type: 'SET_CART', payload: updatedCart });
      
      toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
      toast.error('Failed to add item to cart');
    }
  }

  // Update item quantity in cart
  async function updateItem(lineId: string, quantity: number) {
    if (!state.cart?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const lines = [
        {
          id: lineId,
          quantity,
        },
      ];

      const updatedCart = await updateCartLines(state.cart.id, lines);
      dispatch({ type: 'SET_CART', payload: updatedCart });
      
      if (quantity === 0) {
        toast.success('Item removed from cart');
      } else {
        toast.success('Cart updated');
      }
    } catch (error) {
      console.error('Failed to update cart item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart item' });
      toast.error('Failed to update cart');
    }
  }

  // Remove item from cart
  async function removeItem(lineId: string) {
    if (!state.cart?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const updatedCart = await removeFromCart(state.cart.id, [lineId]);
      dispatch({ type: 'SET_CART', payload: updatedCart });
      
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
      toast.error('Failed to remove item');
    }
  }

  // Clear entire cart
  async function clearCart() {
    if (!state.cart?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const lineIds = state.cart.lines.edges.map(edge => edge.node.id);
      const updatedCart = await removeFromCart(state.cart.id, lineIds);
      dispatch({ type: 'SET_CART', payload: updatedCart });
      
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' });
      toast.error('Failed to clear cart');
    }
  }

  // Helper functions
  const getItemCount = (): number => {
    return state.cart?.totalQuantity || 0;
  };

  const getSubtotal = (): string => {
    if (!state.cart) return '$0.00';
    const amount = parseFloat(state.cart.cost.subtotalAmount.amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.cart.cost.subtotalAmount.currencyCode,
    }).format(amount);
  };

  const isItemInCart = (merchandiseId: string): boolean => {
    if (!state.cart) return false;
    return state.cart.lines.edges.some(
      edge => edge.node.merchandise.id === merchandiseId
    );
  };

  const getItemQuantity = (merchandiseId: string): number => {
    if (!state.cart) return 0;
    const line = state.cart.lines.edges.find(
      edge => edge.node.merchandise.id === merchandiseId
    );
    return line?.node.quantity || 0;
  };

  const contextValue: CartContextType = {
    ...state,
    openCart,
    closeCart,
    toggleCart,
    refreshCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getItemCount,
    getSubtotal,
    isItemInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}