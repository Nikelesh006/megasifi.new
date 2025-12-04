import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId:{type:String, required:true,ref:"user"},
    sellerId: { type: String, required: true },
    name:{type:String, required:true},
    description:{type:String, required:true},
    price:{type:Number, required:true},
    category:{type:String, required:true},
    subCategory:{type:String, required:true},
    offerPrice:{type:Number,required:true},
    image:{type:Array, required:true},
    date:{type:Number,required:true},
    size: {
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        required: true,
    },
    color: {
        type: String,
        required: true,
        trim: true,
    }
})

const Product= mongoose.models.product ||mongoose.model('product',productSchema)

export default Product;