
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    // id: { type: mongoose.Schema.Types.ObjectId, unique: true, required: true },
    author: { type: String, required: true },
    pdffile: { type: String, default:"" },
    audiofile: { type: String, default:"" },
    publisher: { type: String, required: true },
    language: { type: String, required: true },
    paperback: { type: Number, required: true },
    isbn: { type: String, required: true },
    isbn13: { type: String, required: true },
    dimensions: { type: String, required: true },
    weight: { type: String, required: true },
    age: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    total_rating: { type: Number, required: true },
    reviews: { type: Array, required: true },
    price: { type: Number, required: true },
    created_by: { type: String, required: true }, 
    image_url : {type : String , required : true} 
},
{timestamps:true});
let autoIncrement = 1;

productSchema.pre('save', function(next) {
  if (this.isNew) {
    this.id = autoIncrement++;
  }
  next();
});
module.exports = mongoose.model('Product', productSchema);
