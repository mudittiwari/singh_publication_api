
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    coupons: { type: Array, required: true },
});
module.exports = mongoose.model('Coupon', couponSchema);
