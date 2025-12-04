import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/user";
import Address from "@/models/Address";
import Order from "@/models/Order";



export async function POST(request){
    try{

        const { userId } = getAuth(request)
        const { address, items } = await request.json()

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 })
        }

        if (!address || !items || items.length === 0) {
            return NextResponse.json({ success: false, message: "invalid data" })
        }

        await connectDB()

        // calculate amount and build order items
        let amount = 0
        const orderItems = []
        let sellerId = null
        for (const item of items) {
            // Skip mock products (IDs that don't look like ObjectIds)
            if (!item.product || !item.product.match(/^[0-9a-fA-F]{24}$/)) {
                console.log(`Skipping mock product: ${item.product}`);
                continue;
            }
            
            const product = await Product.findById(item.product)
            if (!product) continue

            // Get sellerId from the first valid product
            if (!sellerId && product.sellerId) {
                sellerId = product.sellerId
            }

            amount += product.offerPrice * item.quantity
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.offerPrice,
                size: product.size,
                color: product.color
            })
        }

        if (orderItems.length === 0) {
            return NextResponse.json({ success: false, message: "No valid items to order" }, { status: 400 })
        }

        const addressDoc = await Address.findById(address)
        if (!addressDoc || addressDoc.userId !== userId) {
            return NextResponse.json({ success: false, message: "Invalid address" }, { status: 400 })
        }

        const totalAmount = amount + Math.floor(amount * 0.02)

        const addressSnapshot = {
            fullname: addressDoc.fullname,
            area: addressDoc.area,
            city: addressDoc.city,
            state: addressDoc.state,
            pincode: addressDoc.pincode,
            phoneNumber: addressDoc.phoneNumber
        }

        const order = await Order.create({
            userId,
            sellerId,
            items: orderItems,
            amount: totalAmount,
            address: addressSnapshot,
            addressId: addressDoc._id,
            status: "order placed",
            date: Date.now()
        })

        await inngest.send({
            name:'order/created',
            data:{
                userId,
                address: addressSnapshot,
                addressId: addressDoc._id,
                items: orderItems,
                amount : totalAmount,
                orderId: order._id,
                date:Date.now()
            }
        }
        )

        const user = await User.findById(userId)
        if (user) {
            user.cartItems = {}
            await user.save()
        }

        return NextResponse.json({success:true,message:"Order created successfully", orderId: order._id})



    }catch(error){
        console.log(error)
        return NextResponse.json({success:false,message:error.message})
    }

}