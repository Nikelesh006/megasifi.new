'use client'
import React, { useState, useEffect, Suspense } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {

  const { getToken, fetchProductData } = useAppContext()
  const searchParams = useSearchParams();
  const router = useRouter();
  const editingId = searchParams.get('productId');
  const isEditing = Boolean(editingId);

  const [files, setFiles] = useState([null, null, null, null, null, null, null]);
  const [existingImages, setExistingImages] = useState(['', '', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('T-Shirts');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [sellerId, setSellerId] = useState('');

  const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const [colorInput, setColorInput] = useState('');
  const [colorOptions, setColorOptions] = useState([]);

  const menSubCategories = ['T-Shirts', 'Shirts', 'Pants', 'Jeans', 'Shorts', 'Jackets'];
  const womenSubCategories = ['Tops', 'Sarees', 'Jeans', 'Skirts', 'Kurti', 'Activewear'];
  const homeSubCategories = ['Popular Products', 'Special Offers', 'New Arrivals'];

  const currentSubCategories = category === 'Women' ? womenSubCategories : 
                              category === 'Home' ? homeSubCategories : 
                              menSubCategories;

  useEffect(() => {
    if (!editingId) return;

    const loadProduct = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`/api/product/${editingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success || data._id) {
          setName(data.name || '');
          setDescription(data.description || '');
          setSellerId(data.sellerId || '');
          setCategory(data.category || 'Men');
          setSubCategory(data.subCategory || 'T-Shirts');
          setPrice(data.price?.toString() || '');
          setOfferPrice(data.offerPrice?.toString() || '');

          // images (7 slots) - preserve existing image URLs
          const imgs = data.image || [];
          setExistingImages([
            imgs[0] || '',
            imgs[1] || '',
            imgs[2] || '',
            imgs[3] || '',
            imgs[4] || '',
            imgs[5] || '',
            imgs[6] || '',
          ]);

          // colorOptions with sizes
          setColorOptions(data.colorOptions || []);
        } else {
          toast.error('Failed to load product data');
        }
      } catch (error) {
        toast.error('Error loading product: ' + error.message);
      }
    };

    loadProduct();
  }, [editingId, getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Array.isArray(colorOptions) || !colorOptions.length) {
      toast.error('At least one colour is required');
      return;
    }

    const hasValidSizes = colorOptions.every(opt => 
      opt.sizes && opt.sizes.length > 0
    );

    if (!hasValidSizes) {
      toast.error('Each colour must have at least one size');
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);
    formData.append("sellerId", sellerId);
    formData.append("colorOptions", JSON.stringify(colorOptions));
    formData.append("existingImages", JSON.stringify(existingImages));

    files.forEach((file) => {
      if (file) {
        formData.append("image", file);
      }
    })

    try{
       const token = await getToken()
       const url = isEditing ? `/api/product/${editingId}` : '/api/product/add';
       const method = isEditing ? 'PUT' : 'POST';

       const {data}=await axios({
         method,
         url,
         data: formData,
         headers: { Authorization: `Bearer ${token}` }
       });

       if(data.success){
          toast.success(isEditing ? 'Product updated successfully' : data.message)
          await fetchProductData()
          
          // Reset form and redirect to product list if editing
          if (isEditing) {
            router.push('/seller/product-list');
          } else {
            setFiles([null, null, null, null, null, null, null])
            setExistingImages(['', '', '', '', '', '', ''])
            setName('')
            setDescription('')
            setCategory('Men')
            setSubCategory('T-Shirts')
            setPrice('')
            setOfferPrice('')
            setSellerId('')
            setColorInput('');
            setColorOptions([]);
          }
       }else{
        toast.error(data.message)
       }

    }catch(error){
       toast.error(error.message)
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-10 space-y-4 sm:space-y-5 max-w-7xl mx-auto w-full">
        <div>
          <p className="text-sm sm:text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">

            {[...Array(7)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input onChange={(e) => {
                  const updatedFiles = [...files];
                  updatedFiles[index] = e.target.files[0];
                  setFiles(updatedFiles);
                }} type="file" id={`image${index}`} hidden />
                <Image
                  key={index}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 cursor-pointer"
                  src={
                    files[index] 
                      ? URL.createObjectURL(files[index]) 
                      : existingImages[index] 
                        ? existingImages[index] 
                        : assets.upload_area
                  }
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}

          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm sm:text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none py-2 sm:py-2.5 px-3 rounded border border-gray-500/40 w-full text-sm sm:text-base"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label
            className="text-sm sm:text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none py-2 sm:py-2.5 px-3 rounded border border-gray-500/40 resize-none w-full text-sm sm:text-base"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row lg:items-center lg:gap-5 lg:flex-wrap gap-4">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm sm:text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none py-2 sm:py-2.5 px-3 rounded border border-gray-500/40 w-full text-sm sm:text-base"
              value={category}
              onChange={(e) => {
                const value = e.target.value;
                setCategory(value);
                if (value === 'Women') {
                  setSubCategory('Tops');
                } else if (value === 'Home') {
                  setSubCategory('Popular Products');
                } else {
                  setSubCategory('T-Shirts');
                }
              }}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Home">Home</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm sm:text-base font-medium" htmlFor="sub-category">
              List Item
            </label>
            <select
              id="sub-category"
              className="outline-none py-2 sm:py-2.5 px-3 rounded border border-gray-500/40 w-full text-sm sm:text-base"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              {currentSubCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm sm:text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none py-2 sm:py-2.5 px-3 rounded border border-gray-500/40 w-full text-sm sm:text-base"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm sm:text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none py-2 sm:py-2.5 px-3 rounded border border-gray-500/40 w-full text-sm sm:text-base"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm sm:text-base text-gray-600 mb-2">Colours</p>
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="e.g. red"
              className="outline-none py-2 sm:py-2.5 px-3 rounded border border-gray-500/40 flex-1 text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={() => {
                const c = colorInput.trim().toLowerCase();
                if (!c) return;
                setColorOptions((prev) =>
                  prev.some((opt) => opt.color === c)
                    ? prev
                    : [...prev, { color: c, sizes: [] }]
                );
                setColorInput('');
              }}
              className="px-4 py-2 sm:py-2.5 rounded bg-pink-500 text-white text-sm sm:text-base whitespace-nowrap"
            >
              Add Colour
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {colorOptions.map((opt, index) => (
              <div key={opt.color} className="border rounded p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <p className="font-medium capitalize text-sm sm:text-base">{opt.color}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setColorOptions((prev) =>
                        prev.filter((c) => c.color !== opt.color)
                      )
                    }
                    className="text-xs sm:text-sm text-red-500 self-start sm:self-auto"
                  >
                    Remove
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 mb-2">Available sizes for this colour:</p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {ALL_SIZES.map((size) => (
                    <label key={size} className="flex items-center gap-2 text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        checked={opt.sizes.some(s => typeof s === 'object' ? s.size === size : s === size)}
                        onChange={() =>
                          setColorOptions((prev) =>
                            prev.map((c, i) =>
                              i === index
                                ? {
                                    ...c,
                                    sizes: c.sizes.some(s => typeof s === 'object' ? s.size === size : s === size)
                                      ? c.sizes.filter(s => typeof s === 'object' ? s.size !== size : s !== size)
                                      : [...c.sizes, size]
                                  }
                                : c
                            )
                          )
                        }
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm sm:text-base text-gray-600">Seller ID</label>
          <input
            type="text"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            placeholder="Enter your seller ID"
            className="outline-none py-2 sm:py-2.5 px-3 rounded border border-gray-500/40 w-full text-sm sm:text-base"
            required
          />
        </div>
        <button type="submit" className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-rose-600 text-white font-medium rounded text-sm sm:text-base">
          {isEditing ? 'Update Product' : 'ADD'}
        </button>
      </form>
    </div>
  );
};

// Trigger new deployment
export default function SellerPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <AddProduct />
    </Suspense>
  );
}