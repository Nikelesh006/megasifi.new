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
    brand:{type:String},
    description:{type:String, required:true},
    price:{type:Number, required:true},
    category:{type:String, required:true},
    subCategory:{type:String, required:true},
    offerPrice:{type:Number,required:true},
    image:{type:Array, required:true}, // Supports up to 7 images
    date:{type:Number,required:true},
    colorOptions: { type: [ColorOptionSchema], default: [] },
    tags: [{ type: String }],
    searchKeywords: [{ type: String }], // optional manual keywords
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    popularity: { type: Number, default: 0 }, // derived from sales/views
}, { timestamps: true })

// Text index for full search:
productSchema.index({
  name: 'text',
  brand: 'text',
  category: 'text',
  subCategory: 'text',
  description: 'text',
  tags: 'text',
  searchKeywords: 'text',
});

// Prefix-friendly index for autosuggest:
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });

const Product= mongoose.models.product ||mongoose.model('product',productSchema)

export default Product;