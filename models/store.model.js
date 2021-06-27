const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
        storeName: { type: String, default: "my store!!!", required: true },//חובה
        urlRoute: { type: String },
        storeDescription: { type: String, default: "The best store in the world!!!" },
        logo: { type: String },
        address: { type: String },
        tel: { type: String },
        email: { type: String },
        //חובה!- חנות חיבת מנהל
        storeManager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        storeProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],//list ref to person
        orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
        //כשמוסיפים קטגוריה לחנות- מתוסף אוטומטי למערך הזה
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
        attributes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attribute" }],
        //משלוחים
        shipmentYOrNo: { type: Boolean, default: false },
        urlAddress: { type: String },
        //צבע שולט בחנות
        colorDominates: { type: String },
        //מדיניות
        policy: { type: String },
        //מטבע
        currency: { type: String, default: "ILS" },
        //ניהול מלאי
        checkInventoryManagement: { type: Boolean, default: true },
        //קניה חד-מוצרית
        checkoneProductPurchase: { type: Boolean, default: false },
        //איפשור הזמנה מראש
        preOrderYOrNo: { type: Boolean, default: false },
        //יחידת גודל / אורך
        unitSizeOrLength: { type: String },
        //יחידת משקל
        unitOfWeight: { type: String },
        papers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Paper" }]

}, {
        timestamps: true,
});
const Store = mongoose.model('Store', storeSchema);

module.exports = Store;