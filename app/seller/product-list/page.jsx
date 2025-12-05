'use client'

import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {
  const { router, getToken, user } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const fetchSellerProduct = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/api/product/seller-list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const productList = Array.isArray(data) ? data : data?.data || [];
      setProducts(productList);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this product?");
      if (!confirmDelete) return;

      const token = await getToken();
      const { data } = await axios.delete(`/api/product/delete?id=${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Product deleted successfully");
        setProducts((prevProducts) => prevProducts.filter((item) => item._id !== productId));
        setSelectedProductIds((prevSelected) =>
          prevSelected.filter((id) => id !== productId)
        );
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to delete product");
    }
  };

  const toggleSelectProduct = (productId) => {
    setSelectedProductIds((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedProductIds((prevSelected) =>
      prevSelected.length === products.length ? [] : products.map((product) => product._id)
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedProductIds.length === 0) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedProductIds.length} selected product(s)?`
    );
    if (!confirmDelete) return;

    try {
      const token = await getToken();
      await Promise.all(
        selectedProductIds.map((productId) =>
          axios.delete(`/api/product/delete?id=${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      toast.success("Selected products deleted successfully");
      setProducts((prevProducts) =>
        prevProducts.filter((item) => !selectedProductIds.includes(item._id))
      );
      setSelectedProductIds([]);
    } catch (error) {
      toast.error(error?.message || "Failed to delete selected products");
    }
  };

  // Fetch products ONLY when user changes (mount/login)
  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);

  const allSelected =
    products.length > 0 && selectedProductIds.length === products.length;

  return (
    <div className="flex-1 min-h-screen">
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products added yet.</p>
      ) : (
        <div className="w-full md:p-10 p-4">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-lg font-medium">All Product</h2>
            {selectedProductIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center justify-center gap-1 h-9 px-4 bg-red-600 text-white text-sm rounded-md"
              >
                Delete Selected ({selectedProductIds.length})
              </button>
            )}
          </div>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            {/* Mobile Card View */}
            <div className="md:hidden w-full">
              {products.map((product, index) => (
                <div key={product._id || index} className="border-b border-gray-500/20 p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.includes(product._id)}
                      onChange={() => toggleSelectProduct(product._id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-gray-500/10 rounded p-2">
                          <Image
                            src={product.image[0]}
                            alt="product Image"
                            className="w-16"
                            width={1280}
                            height={720}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-lg font-semibold text-gray-900">₹{product.offerPrice}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{product.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">List Item:</span>
                          <span className="font-medium">{product.subCategory}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Colours:</span>
                          <span className="font-medium">
                            {product.colorOptions?.map((c) => c.color).join(', ') || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sizes:</span>
                          <span className="font-medium">
                            {Array.from(
                              new Set(
                                product.colorOptions?.flatMap((c) => c.sizes?.map((s) => s.size) || [])
                              )
                            ).join(', ') || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Seller ID:</span>
                          <span className="font-medium">{product.sellerId || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => router.push(`/product/${product._id}`)}
                          className="flex-1 flex items-center justify-center gap-1 h-9 px-3 bg-rose-600 text-white text-sm rounded-md"
                        >
                          Visit
                          <Image
                            className="h-3.5"
                            src={assets.redirect_icon}
                            alt="redirect_icon"
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="flex-1 flex items-center justify-center gap-1 h-9 px-3 bg-red-600 text-white text-sm rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop Table View */}
            <table className="hidden md:table table-auto w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="w-2/5 px-4 py-3 font-medium truncate">
                    Product
                  </th>
                  <th className="px-4 py-3 font-medium truncate">
                    Category
                  </th>
                  <th className="px-4 py-3 font-medium truncate">
                    List Item
                  </th>
                  <th className="px-4 py-3 font-medium truncate">
                    Colours
                  </th>
                  <th className="px-4 py-3 font-medium truncate">
                    Sizes
                  </th>
                  <th className="px-4 py-3 font-medium truncate">
                    Seller ID
                  </th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium text-center w-48">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product, index) => (
                  <tr key={product._id || index} className="border-t border-gray-500/20">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(product._id)}
                        onChange={() => toggleSelectProduct(product._id)}
                      />
                    </td>
                    <td className="px-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2">
                        <Image
                          src={product.image[0]}
                          alt="product Image"
                          className="w-16"
                          width={1280}
                          height={720}
                        />
                      </div>
                      <span className="truncate w-full">{product.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      {product.category}
                    </td>
                    <td className="px-4 py-3">
                      {product.subCategory}
                    </td>
                    <td className="px-4 py-3">
                      {product.colorOptions?.map((c) => c.color).join(', ') || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      {Array.from(
                        new Set(
                          product.colorOptions?.flatMap((c) => c.sizes?.map((s) => s.size) || [])
                        )
                      ).join(', ') || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      {product.sellerId || 'N/A'}
                    </td>
                    <td className="px-4 py-3">₹{product.offerPrice}</td>
                    <td className="px-4 py-3 w-48">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/product/${product._id}`)}
                          className="flex items-center justify-center gap-1 h-9 min-w-[88px] px-4 bg-rose-600 text-white text-sm rounded-md"
                        >
                          <span>Visit</span>
                          <Image
                            className="h-3.5"
                            src={assets.redirect_icon}
                            alt="redirect_icon"
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="flex items-center justify-center gap-1 h-9 min-w-[88px] px-4 bg-red-600 text-white text-sm rounded-md"
                        >
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;



