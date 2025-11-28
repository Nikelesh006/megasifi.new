// lib/wishlistManager.js
// Wishlist stored in localStorage so it survives page refresh

const WISHLIST_KEY = 'megasifi_wishlist';

const safeGet = () => {
  if (typeof window === 'undefined') return [];
  try {
    const data = window.localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const safeSet = (items) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
};

export const addToWishlist = (productId) => {
  const items = safeGet();
  if (!items.includes(productId)) {
    items.push(productId);
    safeSet(items);
  }
  return true;
};

export const removeFromWishlist = (productId) => {
  const items = safeGet().filter((id) => id !== productId);
  safeSet(items);
  return true;
};

export const isLiked = (productId) => {
  const items = safeGet();
  return items.includes(productId);
};

export const getWishlistItems = () => {
  return safeGet();
};

export const clearWishlist = () => {
  safeSet([]);
};
