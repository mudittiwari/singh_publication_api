const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  ProductsArray: { type: Array, required: true },
  totalAmount: { type: Number, required: true },
  ordered_by:{ type: String, required: true },
  delivery_date:{ type : String, default : ""},
  invoice_file:{type : String , default : ""},
  delivery_status:{type : String , default : "Pending"},
  delivery_address:{type : String ,required:true},
},{timestamps:true});
let autoIncrement = 1;

OrderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.id = autoIncrement++;
  }
  next();
});
 const OrderModel = mongoose.model('Order', OrderSchema);

 module.exports = OrderModel;