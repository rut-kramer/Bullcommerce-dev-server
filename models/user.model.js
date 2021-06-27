const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // uid: { type: String, required: true },//חובה- מתוסף אוטומטי בכניסה עם firebase
    // firstName:{type:String},
    // lastName:{type:String},
    username: { type: String, required: true },//חובה
    //לא חובה מכיוון שכשמשתמש נכנס דרך גוגל הוא לא צריך סיסמא
    password: { type: String },
    email: { type: String, required: false },
    stores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Store" }],//משתמש שמנהל חנויות
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],//ההזמנות שהזמין נרשמות אצלו
    profilePicture: { type: String },
    status: { type: String },
    IP: { type: String }

}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;