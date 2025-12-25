'use client'
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth } from '@clerk/nextjs';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || '₹';
  const router = useRouter();

  const { user } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [likedItems, setLikedItems] = useState([]); // <-- NEW
  const [searchQuery, setSearchQuery] = useState('');
  const [subCategoryFilter, setSubCategoryFilter] = useState('All');

  const fetchProductData = async () => {
    try {
      setIsLoadingProducts(true);
      const { data } = await axios.get('/api/product/list');

      if (data.success) {
        setProducts(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchUserData = async () => {
    try {
      if (!user) return;

      if (user.publicMetadata?.role === 'seller') {
        setIsSeller(true);
      }

      const token = await getToken();

      const { data } = await axios.get('/api/user/data', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user?.cartItems || []);
        setLikedItems(data.user?.wishlist || []); // <-- load wishlist
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addToCart = async (itemId, options = {}) => {
    const { color, size, image } = options;
    
    if (!color) {
      toast.error('Please select color');
      return;
    }

    // Check if the selected color has sizes available
    const product = products.find(p => p._id === itemId);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    const colorOption = product.colorOptions?.find(c => c.color === color);
    const hasSizes = colorOption && colorOption.sizes && colorOption.sizes.length > 0;
    
    if (hasSizes && !size) {
      toast.error('Please select size');
      return;
    }

    // Create a unique key for the variant
    const variantKey = `${itemId}-${color}-${size || 'no-size'}`;
    
    let cartData = structuredClone(cartItems);
    const existingItemIndex = cartData.findIndex(item => 
      item.productId === itemId && item.color === color && (item.size === size || (!item.size && !size))
    );
    
    if (existingItemIndex >= 0) {
      cartData[existingItemIndex].qty += 1;
    } else {
      const product = products.find(p => p._id === itemId);
      if (!product) {
        toast.error('Product not found');
        return;
      }
      
      cartData.push({
        productId: itemId,
        name: product.name,
        price: product.offerPrice,
        color,
        size: size || '',
        image: image || product.image[0],
        qty: 1
      });
    }
    
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();

        await axios.put(
          '/api/cart/update',
          { cartItems: cartData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Item added to cart");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const updateCartQuantity = async (index, quantity) => {
    let cartData = structuredClone(cartItems);
    
    if (quantity === 0 || index < 0 || index >= cartData.length) {
      cartData.splice(index, 1);
    } else {
      cartData[index].qty = quantity;
    }
    
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();

        await axios.put(
          '/api/cart/update',
          { cartItems: cartData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Item updated in cart");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => total + (item.qty || 0), 0);
  };

  const getCartAmount = () => {
    if (!Array.isArray(cartItems)) return 0;
    let totalAmount = 0;
    
    for (const item of cartItems) {
      const quantity = item.qty || 0;
      if (quantity <= 0) continue;

      const itemInfo = products.find((product) => product._id === item.productId);
      if (!itemInfo || typeof itemInfo.offerPrice !== 'number') {
        continue;
      }

      totalAmount += itemInfo.offerPrice * quantity;
    }
    
    return Math.floor(totalAmount * 100) / 100;
  };

  // ---- Wishlist logic ----
  const isLiked = (productId) => likedItems.includes(productId);

  const toggleLike = async (productId) => {
    if (!user) {
      toast.error("Please sign in to like products");
      router.push('/sign-in');
      return;
    }

    let updated;
    if (likedItems.includes(productId)) {
      updated = likedItems.filter((id) => id !== productId);
    } else {
      updated = [...likedItems, productId];
      toast.success("Added to liked products");
    }
    setLikedItems(updated);

    try {
      const token = await getToken();
      await axios.put(
        '/api/wishlist/update',
        { wishlist: updated },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      toast.error(error.message);
    }
  };
  // -----------------------

  const clearFilters = () => {
    setSearchQuery('');
    setSubCategoryFilter('All');
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setUserData(false);
      setCartItems([]);
      setLikedItems([]); // clear wishlist on logout
      setIsSeller(false);
    }
  }, [user]);

  const value = {
    user, getToken,
    currency, router,
    isSeller, setIsSeller,
    userData, fetchUserData,
    products, fetchProductData,
    isLoadingProducts,
    cartItems, setCartItems,
    addToCart, updateCartQuantity,
    getCartCount, getCartAmount,
    searchQuery, setSearchQuery,
    subCategoryFilter, setSubCategoryFilter,
    clearFilters,
    likedItems, isLiked, toggleLike, // <-- expose wishlist
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
