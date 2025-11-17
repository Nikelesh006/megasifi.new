import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
     userId:{type:String,required:true, ref:"User"},
     items:[{
        product:{type:String,required:true, ref:"Product"},
        quantity:{type:Number,required:true},
        price:{type:Number,required:true}
     }],
     amount:{type:Number,required:true},
     address:{type:String,required:true, ref:"Address"},
     status:{type:String,required:true,default:'order placed'},
     date:{type:Number,required:tr}
})
    
const Order=mongoose.models.order || mongoose.model("order",orderSchema)

export default Order