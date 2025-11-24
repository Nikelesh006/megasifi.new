// Simple in-memory wishlist storage (for demo purposes)
// In production, this would be replaced with backend API calls

let wishlistItems = new Set();

export const addToWishlist = (productId) => {
  wishlistItems.add(productId);
  return true;
};

export const removeFromWishlist = (productId) => {
  return wishlistItems.delete(productId);
};

export const isLiked = (productId) => {
  return wishlistItems.has(productId);
};

export const getWishlistItems = () => {
  return Array.from(wishlistItems);
};

export const clearWishlist = () => {
  wishlistItems.clear();
};
