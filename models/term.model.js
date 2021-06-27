const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// מונח לתכונה
const termSchema = new Schema({

        name: { type: String },//חובה
        image: [{ type: String }],
        description: { type: String },
        // store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
        attribute: { type: mongoose.Schema.Types.ObjectId, ref: "Attribute" }
        // variation: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variation" }]

}, {
        timestamps: true,
});

const Term = mongoose.model('Term', termSchema);

module.exports = Term;