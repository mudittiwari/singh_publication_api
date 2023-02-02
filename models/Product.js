
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    // id: { type: mongoose.Schema.Types.ObjectId, unique: true, required: true },
    name: { type: String, required: true },
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
