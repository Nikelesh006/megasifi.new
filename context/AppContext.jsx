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
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [likedItems, setLikedItems] = useState([]); // <-- NEW
  const [searchQuery, setSearchQuery] = useState('');
  const [subCategoryFilter, setSubCategoryFilter] = useState('All');

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get('/api/product/list');

      if (data.success) {
        setProducts(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
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
        setCartItems(data.user?.cartItems || {});
        setLikedItems(data.user?.wishlist || []); // <-- load wishlist
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();

        await axios.put(
          '/api/cart/update',
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Item added to cart");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();

        await axios.put(
          '/api/cart/update',
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Item updated in cart");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const quantity = cartItems[items];
      if (!quantity || quantity <= 0) continue;

      const itemInfo = products.find((product) => product._id === items);
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
      setCartItems({});
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
