'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {

    const { currency, getToken, user, router } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSellerOrders = async () => {
        try{
            console.log('Fetching seller orders...');
            const token = await getToken()
            console.log('Token obtained:', token ? 'Yes' : 'No');

            const { data } = await axios.get('/api/order/seller-order', { 
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store'
            })

            console.log('API response:', data);

            if(data.success){
                console.log('Orders fetched successfully:', data.orders?.length || 0, 'orders');
                setOrders(data.orders || []);
                setLoading(false)
            }else{
                console.error('API returned error:', data.message);
                toast.error(data.message);
                setOrders([]);
                setLoading(false);
            }
        
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error(error.message || 'Failed to fetch orders');
            setOrders([]);
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user){
          fetchSellerOrders();
        }
    }, [user]);

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <h2 className="text-lg font-medium">Orders</h2>
                <div className="max-w-4xl rounded-md">
                    {orders.map((order, index) => {
                        const firstItem = order.items?.[0];
                        return (
                        <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
                            <div className="flex-1 flex gap-5 max-w-80">
                                <div className="flex-shrink-0">
                                    {firstItem?.image ? (
                                        <div 
                                            className="cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => {
                                                if (firstItem.product?._id) {
                                                    router.push(`/product/${firstItem.product._id}`);
                                                } else if (firstItem.product) {
                                                    router.push(`/product/${firstItem.product}`);
                                                }
                                            }}
                                        >
                                            <Image
                                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                                src={firstItem.image}
                                                alt={firstItem.product?.name || 'Product image'}
                                                width={64}
                                                height={64}
                                            />
                                        </div>
                                    ) : (
                                        <Image
                                            className="max-w-16 max-h-16 object-cover"
                                            src={assets.box_icon}
                                            alt="box_icon"
                                        />
                                    )}
                                </div>
                                <p className="flex flex-col gap-3">
                                    <span className="font-medium">
                                        {order.items.map((item) => {
                                            const size = item.size || 'N/A';
                                            const color = item.color || 'N/A';
                                            return `${item.product?.name || 'Product'} (Size: ${size}, Color: ${color}) x ${item.quantity}`;
                                        }).join(", ")}
                                    </span>
                                    <span>Items : {order.items.length}</span>
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-medium">{order.address?.fullname || order.address?.fullName}</span>
                                    <br />
                                    <span >{order.address?.area}</span>
                                    <br />
                                    <span>{`${order.address?.city}, ${order.address?.state}`}</span>
                                    <br />
                                    <span>{order.address?.phoneNumber}</span>
                                </p>
                            </div>
                            <p className="font-medium my-auto">{currency}{order.amount}</p>
                            <div>
                                <p className="flex flex-col">
                                    <span>Method : UPI</span>
                                    <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                    <span>Payment : {order.status === 'paid' ? 'Paid successfully' : 'Pending'}</span>
                                    <span className="text-xs font-medium">Seller ID: {order.sellerId}</span>
                                </p>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>}
            <Footer />
        </div>
    );
};

export default Orders;