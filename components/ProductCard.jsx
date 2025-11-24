import React from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {
    const { currency, router, addToCart } = useAppContext();

    return (
        <div
            onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer group transition-all duration-300 bg-white rounded-lg shadow-sm hover:shadow-lg hover:shadow-rose-100 border border-gray-100 hover:border-rose-200 transform hover:-translate-y-1"
        >
            {/* Image container with old money theme */}
            <div className="relative rounded-lg w-full h-52 flex items-center justify-center overflow-hidden group bg-old-cream hover:bg-old-light/60 transition-all duration-300">
                <div className="absolute inset-0 bg-old-gold/0 group-hover:bg-old-gold/5 transition-all duration-300 z-0"></div>
                
                <div className="relative w-full h-full flex items-center justify-center p-3 group-hover:p-4 transition-all duration-300">
                    <Image
                        src={product.image[0]}
                        alt={product.name}
                        className="transition-all duration-300 object-contain max-h-full max-w-full z-10"
                        width={400}
                        height={400}
                        style={{ 
                            width: 'auto',
                            height: 'auto',
                            maxWidth: '100%',
                            maxHeight: '100%'
                        }}
                    />
                </div>
                
                <button 
                    className="absolute top-2 right-2 bg-old-cream/80 group-hover:bg-old-cream p-2 rounded-full shadow-sm group-hover:shadow-md z-20 transition-all duration-300 transform hover:scale-110"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Add to wishlist functionality here
                    }}
                >
                    <Image
                        className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                        src={assets.heart_icon}
                        alt="heart_icon"
                    />
                </button>
            </div>

            {/* Product info */}
            <div className="w-full px-2 group-hover:px-3 transition-all duration-300">
                <p className="md:text-base font-medium pt-2 w-full truncate group-hover:text-old-gold transition-colors duration-300">
                    {product.name}
                </p>
                <p className="w-full text-xs text-old-muted max-sm:hidden truncate mt-0.5">
                    {product.description}
                </p>
            </div>

            {/* Price and action */}
            <div className="w-full px-2 group-hover:px-3 transition-all duration-300">
                <div className="flex items-center gap-2">
                    <p className="text-xs text-old-olive">{4.5}</p>
                    <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Image
                                key={index}
                                className="h-3 w-3"
                                src={
                                    index < Math.floor(4)
                                        ? assets.star_icon
                                        : assets.star_dull_icon
                                }
                                alt="star_icon"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-end justify-between w-full mt-1.5">
                    <p className="text-base font-medium text-old-olive">
                        {currency}{product.offerPrice}
                        {product.originalPrice && (
                            <span className="ml-1 text-xs text-old-muted line-through">
                                {currency}{product.originalPrice}
                            </span>
                        )}
                    </p>
                    <button 
                        className="max-sm:hidden px-4 py-1.5 text-rose-600 border border-rose-600 rounded-full text-xs hover:bg-rose-50 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product._id);
                        }}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;