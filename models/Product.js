import mongoose from "mongoose";

const SizeOptionSchema = new mongoose.Schema({
    size: {
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        required: true,
    },
    stock: { type: Number, default: 0 },
});

const ColorOptionSchema = new mongoose.Schema({
    color: { type: String, required: true },
    images: [String],
    sizes: { type: [SizeOptionSchema], default: [] },
});

const productSchema = new mongoose.Schema({
    userId:{type:String, required:true,ref:"user"},
    sellerId: { type: String, required: true },
    name:{type:String, required:true},
    description:{type:String, required:true},
    price:{type:Number, required:true},
    category:{type:String, required:true},
    subCategory:{type:String, required:true},
    offerPrice:{type:Number,required:true},
    image:{type:Array, required:true}, // Supports up to 7 images
    date:{type:Number,required:true},
    colorOptions: { type: [ColorOptionSchema], default: [] },
})

const Product= mongoose.models.product ||mongoose.model('product',productSchema)

export default Product;