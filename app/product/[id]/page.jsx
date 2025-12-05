"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";

const Product = () => {

    const { id } = useParams();

    const { products, router, addToCart, currency } = useAppContext()

    // Add delete handler to remove product via API and navigate away on success
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
        try {
            const res = await fetch(`/api/product/delete?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            // navigate back to home or products list after deletion
            router.push("/");
        } catch (err) {
            console.error(err);
            alert("Failed to delete product.");
        }
    }

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    const fetchProductData = async () => {
        const product = products.find(product => product._id === id);
        setProductData(product);
        
        // Initialize color and size selection
        if (product && product.colorOptions && product.colorOptions.length > 0) {
            const firstColor = product.colorOptions[0].color;
            setSelectedColor(firstColor);
            
            const firstColorSizes = product.colorOptions.find(c => c.color === firstColor)?.sizes || [];
            if (firstColorSizes.length > 0) {
                setSelectedSize(firstColorSizes[0].size);
            }
        }
        
        // Find similar variants
        if (product) {
            const similarVariants = products.filter(p => 
                p._id !== id && 
                p.category === product.category && 
                p.subCategory === product.subCategory && 
                p.sellerId === product.sellerId
            );
            setVariants(similarVariants);
        }
    }

    useEffect(() => {
        fetchProductData();
    }, [id, products.length])

    const sizesForColor = (color) => {
        const found = productData?.colorOptions?.find((c) => c.color === color);
        return found ? found.sizes.map((s) => s.size) : [];
    };

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            alert('Please select colour and size');
            return;
        }

        addToCart(productData._id, {
            color: selectedColor,
            size: selectedSize,
            image: productData.colorOptions?.find(c => c.color === selectedColor)?.images?.[0] || productData.image[0]
        });
    };

    const handleBuyNow = () => {
        if (!selectedColor || !selectedSize) {
            alert('Please select colour and size');
            return;
        }

        addToCart(productData._id, {
            color: selectedColor,
            size: selectedSize,
            image: productData.colorOptions?.find(c => c.color === selectedColor)?.images?.[0] || productData.image[0]
        });
        router.push('/cart');
    };

    return productData ? (
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
                        <Image
                            src={mainImage || productData.image[0]}
                            alt="alt"
                            className="w-full h-auto object-cover mix-blend-multiply"
                            width={1280}
                            height={720}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {productData.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(image)}
                                className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                            >
                                <Image
                                    src={image}
                                    alt="alt"
                                    className="w-full h-auto object-cover mix-blend-multiply"
                                    width={1280}
                                    height={720}
                                />
                            </div>

                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                        {productData.name}
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image
                                className="h-4 w-4"
                                src={assets.star_dull_icon}
                                alt="star_dull_icon"
                            />
                        </div>
                        <p>(4.5)</p>
                    </div>
                    <p className="text-gray-600 mt-3">
                        {productData.description}
                    </p>
                    <p className="text-3xl font-medium mt-6">
                        {currency}{productData.offerPrice}
                        <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                            {currency}{productData.price}
                        </span>
                    </p>

                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full max-w-72">
                            <tbody>
                                <tr>
                                    <td className="text-gray-600 font-medium">Category</td>
                                    <td className="text-gray-800/50">
                                        {productData.category}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <hr className="bg-gray-600 my-6" />

                    {productData.colorOptions && productData.colorOptions.length > 0 && (
                        <>
                            <div className="mt-4">
                                <p className="text-sm font-medium mb-1">Colours available</p>
                                <div className="flex flex-wrap gap-2">
                                    {productData.colorOptions.map((c) => (
                                        <button
                                            key={c.color}
                                            type="button"
                                            onClick={() => {
                                                setSelectedColor(c.color);
                                                const sizes = sizesForColor(c.color);
                                                if (!sizes.includes(selectedSize)) {
                                                    setSelectedSize(sizes[0] || '');
                                                }
                                            }}
                                            className={`px-3 py-1 rounded-full border text-xs capitalize ${
                                                selectedColor === c.color
                                                    ? 'bg-pink-500 text-white border-pink-500'
                                                    : 'bg-white text-gray-800 border-gray-300'
                                            }`}
                                        >
                                            {c.color}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-medium mb-1">Sizes available</p>
                                <div className="flex flex-wrap gap-2">
                                    {sizesForColor(selectedColor).map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-1 rounded-full border text-sm ${
                                                selectedSize === size
                                                    ? 'border-pink-500 bg-pink-50'
                                                    : 'border-gray-300 bg-white'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex items-center mt-10 gap-4">
                        <button onClick={handleAddToCart} className="w-full py-3.5 border border-rose-600 text-rose-600 hover:bg-rose-50 transition">
                            Add to Cart
                        </button>
                        <button onClick={handleBuyNow} className="w-full py-3.5 bg-rose-500 text-white hover:bg-rose-600 transition">
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Similar variants section */}
            {variants.length > 0 && (
                <section className="mt-10">
                    <h3 className="text-lg font-semibold mb-4">More sizes & colors</h3>
                    <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
                        {variants.map((v) => (
                            <ProductCard key={v._id} product={v} />
                        ))}
                    </div>
                </section>
            )}
            
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 mt-16">
                    <p className="text-3xl font-medium">Featured <span className="font-medium text-rose-600">Products</span></p>
                    <div className="w-28 h-0.5 bg-rose-600 mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-6 pb-14 w-full max-w-6xl mx-auto">
                    {products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                    See more
                </button>
            </div>
        </div>
    ) : <Loading />
};

export default Product;