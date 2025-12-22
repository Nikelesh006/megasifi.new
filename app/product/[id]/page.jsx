"use client"
import { useEffect, useMemo, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import { Loader2 } from "lucide-react";

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
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);

    const featuredProducts = useMemo(() => {
        if (!productData) return [];

        const currentId = String(productData._id || id);
        const sameCategory = products.filter(
            (p) => p && String(p._id) !== currentId && p.category === productData.category
        );

        const sameSubCategory = sameCategory.filter(
            (p) => p.subCategory === productData.subCategory
        );

        const combined = [...sameSubCategory, ...sameCategory.filter((p) => p.subCategory !== productData.subCategory)];
        if (combined.length === 0) return [];

        const hash = Array.from(currentId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const offset = hash % combined.length;
        const rotated = [...combined.slice(offset), ...combined.slice(0, offset)];

        return rotated.slice(0, 8);
    }, [products, productData, id]);

    const fetchProductData = async () => {
        try {
            // First try to get fresh data from API
            const response = await fetch(`/api/product/${id}`);
            if (response.ok) {
                const freshProduct = await response.json();
                setProductData(freshProduct);
                
                // Initialize color and size selection
                if (freshProduct && freshProduct.colorOptions && freshProduct.colorOptions.length > 0) {
                    const firstColor = freshProduct.colorOptions[0].color;
                    setSelectedColor(firstColor);
                    
                    const firstColorSizes = freshProduct.colorOptions.find(c => c.color === firstColor)?.sizes || [];
                    if (firstColorSizes.length > 0) {
                        setSelectedSize(firstColorSizes[0].size);
                    }
                }
            } else {
                // Fallback to context data if API fails
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
            }
        } catch (error) {
            console.error("Error fetching product data:", error);
            // Fallback to context data
            const product = products.find(product => product._id === id);
            setProductData(product);
        }
    }

    useEffect(() => {
        fetchProductData();
    }, [id])

    useEffect(() => {
        // Initialize current image index when product data loads
        if (productData && productData.image.length > 0) {
            setCurrentImageIndex(0);
            setMainImage(productData.image[0]);
        }
    }, [productData])

    useEffect(() => {
        
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchProductData();
            }
        };

        const handleFocus = () => {
            fetchProductData();
        };

        const handlePopState = () => {
            fetchProductData();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);
        window.addEventListener('popstate', handlePopState);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [id])

    const sizesForColor = (color) => {
        const found = productData?.colorOptions?.find((c) => c.color === color);
        return found ? found.sizes.map((s) => s.size) : [];
    };

    const handleAddToCart = async () => {
        if (!selectedColor) {
            alert('Please select colour');
            return;
        }

        const availableSizes = sizesForColor(selectedColor);
        
        if (availableSizes.length > 0 && !selectedSize) {
            alert('Please select size');
            return;
        }

        if (isAddingToCart) return; // Prevent double-click

        setIsAddingToCart(true);
        try {
            await addToCart(productData._id, {
                color: selectedColor,
                size: availableSizes.length > 0 ? selectedSize : '',
                image: productData.colorOptions?.find(c => c.color === selectedColor)?.images?.[0] || productData.image[0]
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!selectedColor) {
            alert('Please select colour');
            return;
        }

        const availableSizes = sizesForColor(selectedColor);
        
        if (availableSizes.length > 0 && !selectedSize) {
            alert('Please select size');
            return;
        }

        if (isBuyingNow) return; // Prevent double-click

        setIsBuyingNow(true);
        try {
            await addToCart(productData._id, {
                color: selectedColor,
                size: availableSizes.length > 0 ? selectedSize : '',
                image: productData.colorOptions?.find(c => c.color === selectedColor)?.images?.[0] || productData.image[0]
            });
            await router.push('/cart');
        } catch (error) {
            console.error('Error processing buy now:', error);
        } finally {
            setIsBuyingNow(false);
        }
    };

    // Handle image navigation
    const handleImageChange = (index) => {
        setCurrentImageIndex(index);
        setMainImage(productData.image[index]);
    };

    // Handle touch/swipe events for mobile
    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        const startX = touch.clientX;
        return startX;
    };

    const handleTouchEnd = (e) => {
        const touch = e.changedTouches[0];
        const endX = touch.clientX;
        return endX;
    };

    const handleSwipe = (startX, endX) => {
        const threshold = 50; // Minimum swipe distance
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentImageIndex < productData.image.length - 1) {
                // Swipe left - next image
                handleImageChange(currentImageIndex + 1);
            } else if (diff < 0 && currentImageIndex > 0) {
                // Swipe right - previous image
                handleImageChange(currentImageIndex - 1);
            }
        }
    };

    return productData ? (
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
                        <div 
                            className="relative touch-pan-y"
                            onTouchStart={(e) => {
                                e.currentTarget.dataset.startX = handleTouchStart(e);
                            }}
                            onTouchEnd={(e) => {
                                const startX = parseFloat(e.currentTarget.dataset.startX);
                                const endX = handleTouchEnd(e);
                                handleSwipe(startX, endX);
                            }}
                        >
                            <Image
                                src={productData.image[currentImageIndex] || productData.image[0]}
                                alt="alt"
                                className="w-full h-auto object-cover mix-blend-multiply"
                                width={1280}
                                height={720}
                            />
                            {/* Mobile swipe indicators */}
                            <div className="md:hidden absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                                {productData.image.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition-colors ${
                                            currentImageIndex === index
                                                ? 'bg-white'
                                                : 'bg-white/50'
                                        }`}
                                        onClick={() => handleImageChange(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile swipeable gallery */}
                    <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                        <div className="flex gap-2 pb-2">
                            {productData.image.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleImageChange(index)}
                                    className={`flex-shrink-0 w-24 cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 snap-center transition-all ${
                                        currentImageIndex === index ? 'ring-2 ring-rose-500' : ''
                                    }`}
                                >
                                    <div className="relative">
                                        <Image
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-24 object-cover mix-blend-multiply"
                                            width={128}
                                            height={128}
                                        />
                                        {/* Show +N overlay on 4th image when there are more than 4 images */}
                                        {index === 3 && productData.image.length > 4 && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="text-white font-semibold text-lg">
                                                    +{productData.image.length - 3}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop scrollable gallery */}
                    <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="flex gap-2 pb-2">
                            {productData.image.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleImageChange(index)}
                                    className={`flex-shrink-0 w-20 cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 transition-all hover:ring-2 hover:ring-rose-500 ${
                                        currentImageIndex === index ? 'ring-2 ring-rose-500' : ''
                                    }`}
                                >
                                    <div className="relative">
                                        <Image
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-20 object-cover mix-blend-multiply"
                                            width={80}
                                            height={80}
                                        />
                                        {/* Show +N overlay on 4th image when there are more than 4 images */}
                                        {index === 3 && productData.image.length > 4 && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">
                                                    +{productData.image.length - 3}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
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

                            {sizesForColor(selectedColor).length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-medium mb-1">Sizes available</p>
                                <div className="flex flex-wrap gap-2">
                                    {sizesForColor(selectedColor).map((size, index) => (
                                        <button
                                            key={`${size}-${index}`}
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
                        )}
                        </>
                    )}

                    <div className="flex items-center mt-10 gap-4">
                        <button 
                            type="button" 
                            onClick={handleAddToCart} 
                            disabled={isAddingToCart || isBuyingNow}
                            className={`w-full py-3.5 border transition flex items-center justify-center gap-2 ${
                                isAddingToCart 
                                    ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed' 
                                    : 'border-rose-600 text-rose-600 hover:bg-rose-50 active:scale-[0.98]'
                            }`}
                        >
                            {isAddingToCart ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Adding...</span>
                                </>
                            ) : (
                                <span>Add to Cart</span>
                            )}
                        </button>
                        <button 
                            type="button" 
                            onClick={handleBuyNow} 
                            disabled={isBuyingNow || isAddingToCart}
                            className={`w-full py-3.5 transition flex items-center justify-center gap-2 ${
                                isBuyingNow 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98]'
                            }`}
                        >
                            {isBuyingNow ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <span>Buy now</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 mt-16">
                    <p className="text-3xl font-medium">Featured <span className="font-medium text-rose-600">Products</span></p>
                    <div className="w-28 h-0.5 bg-rose-600 mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-6 pb-14 w-full max-w-6xl mx-auto">
                    {featuredProducts.map((product) => <ProductCard key={product._id} product={product} />)}
                </div>
                <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                    See more
                </button>
            </div>
        </div>
    ) : <Loading />
};

export default Product;