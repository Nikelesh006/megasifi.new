'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {

  const { getToken, fetchProductData } = useAppContext()

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('T-Shirts');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [sellerId, setSellerId] = useState('');

  const menSubCategories = ['T-Shirts', 'Shirts', 'Pants', 'Jeans', 'Shorts', 'Jackets'];
  const womenSubCategories = ['Tops', 'Sarees', 'Jeans', 'Skirts', 'Kurti', 'Activewear'];
  const homeSubCategories = ['Popular Products', 'Special Offers', 'New Arrivals'];

  const currentSubCategories = category === 'Women' ? womenSubCategories : 
                              category === 'Home' ? homeSubCategories : 
                              menSubCategories;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData=new FormData()
    formData.append("name",name)
    formData.append("description",description)
    formData.append("category",category)
    formData.append("subCategory", subCategory)
    formData.append("price",price)
    formData.append("offerPrice",offerPrice)
    formData.append("sellerId", sellerId)

    files.forEach((file) => {
      if (file) {
        formData.append("image", file)
      }
    })

    try{

       const token = await getToken()

       const {data}=await axios.post("/api/product/add",formData,{ headers:{ Authorization: `Bearer ${token}` }});

       if(data.success){
          toast.success(data.message)
          await fetchProductData()
          setFiles([])
          setName('')
          setDescription('')
          setCategory('Men')
          setSubCategory('T-Shirts')
          setPrice('')
          setOfferPrice('')
          setSellerId('')
       }else{
        toast.error(data.message)
       }

    }catch(error){
       toast.error(error.message)
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">

            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input onChange={(e) => {
                  const updatedFiles = [...files];
                  updatedFiles[index] = e.target.files[0];
                  setFiles(updatedFiles);
                }} type="file" id={`image${index}`} hidden />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}

          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
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
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="sub-category">
              List Item
            </label>
            <select
              id="sub-category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
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
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 max-w-md">
          <label className="text-sm text-gray-600">Seller ID</label>
          <input
            type="text"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            placeholder="Enter your seller ID"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>
        <button type="submit" className="px-8 py-2.5 bg-rose-600 text-white font-medium rounded">
          ADD
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;