'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";


const MyOrders = () => {

    const { currency, getToken, user } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const { data } = await axios.get('/api/order/list', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setOrders((data.orders || []).reverse());
            } else {
                toast.error(data.message || 'Failed to load orders');
                setOrders([]);
            }
            setLoading(false);
        } catch (error) {
            toast.error(error?.message || 'Failed to load orders');
            setOrders([]);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    return (
        <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
            <div className="space-y-5">
                <h2 className="text-lg font-medium mt-6">My Orders</h2>

                {loading ? <Loading /> : (
                    <div className="max-w-5xl border-t border-gray-300 text-sm">
                    {orders.length === 0 ? (
                        <p className="py-6 text-gray-500">No orders yet.</p>
                    ) : (
                    orders.map((order, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300">
                            <div className="flex-1 flex gap-5 max-w-80">
                                <Image
                                    className="max-w-16 max-h-16 object-cover"
                                    src={assets.box_icon}
                                    alt="box_icon"
                                />
                                <p className="flex flex-col gap-3">
                                    <span className="font-medium text-base">
                                        {order.items?.map((item) => {
                                            const name = item.product?.name || 'Product';
                                            const size = item.size || 'N/A';
                                            const color = item.color || 'N/A';
                                            return `${name} (Size: ${size}, Color: ${color}) x ${item.quantity}`;
                                        }).join(', ')}
                                    </span>
                                    <span>Items : {order.items?.length || 0}</span>
                                </p>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p className="uppercase text-xs tracking-wide text-gray-500 mb-1">Shipping address</p>
                                <p className="leading-relaxed">
                                    <span className="font-medium text-gray-800">{order.address?.fullname || '—'}</span>
                                    <br />
                                    <span>{order.address?.area}</span>
                                    <br />
                                    <span>
                                        {order.address?.city || ''}
                                        {order.address?.state ? `, ${order.address.state}` : ''}
                                        {order.address?.pincode ? ` - ${order.address.pincode}` : ''}
                                    </span>
                                    <br />
                                    <span>{order.address?.phoneNumber}</span>
                                </p>
                            </div>
                            <p className="font-medium my-auto">{currency}{order.amount}</p>
                            <div>
                                <p className="flex flex-col">
                                    <span>Method : COD</span>
                                    <span>Date : {order.date ? new Date(order.date).toLocaleDateString() : '-'}</span>
                                    <span>Payment : Pending</span>
                                </p>
                            </div>
                        </div>
                    )))}
                </div>)}
            </div>
        </div>
    );
};

export default MyOrders;