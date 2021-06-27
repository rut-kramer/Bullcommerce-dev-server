const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrementModelID = require('./counter.model');
//הזמנה
const orderSchema = new Schema({
        trackingID: { type: Number, unique: true, min: 1 },//חובה
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userAddress: { type: String },
        userPhone: { type: String },
        date: { type: Date, default: Date.now(), required: true },//-ברירת מחדל- היוםחובה
        status: { type: String, required: true, default: "waiting..." },//חובה- בברירת מחדל יהיה בהמתנה
        store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },//חובה
        products: {
                type: [{
                        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                        amount: Number
                }], required: true
        },//חובה בהזמנה לפחות מוצר אחד
        //מתחשבן אוטומטי ביצירת הזמנה ע"י חישוב של מחיר מוצר כפול כמות- עבור כל המוצרים
        totalPrice: { type: Number }
}, {
        timestamps: true,
});
orderSchema.pre('save', function (next) {
        if (!this.isNew) {
                next();
                return;
        }
        autoIncrementModelID('activities', this, next);
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;