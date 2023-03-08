

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  phone_number:{type : Number,required:true,unique:true},
  password: { type: String, required: true },
  dob:{type:Date,required:true},
  wishlist:[Number],
  cart:[Number],
  orders:[{type:Object}],
  role:{type : String , default : 'user'}  
});
let autoIncrement = 1;

userSchema.pre('save', function(next) {
  if (this.isNew) {
    this.id = autoIncrement++;
  }
  next();
});

 module.exports = mongoose.model('User', userSchema);


 //how to make a mongoose field as array and it stores object as each element in the array