const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//תכונה למוצר
const storeNavbarDesignSchema = new Schema({

        store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
        backgroundColor: { type: String },
        textColor: { type: String },
        activeTextColor: { type: String }

}, {
        timestamps: true,
});

const StoreNavbarDesignSchema = mongoose.model('StoreNavbarDesign', storeNavbarDesignSchema);

module.exports = StoreNavbarDesignSchema;