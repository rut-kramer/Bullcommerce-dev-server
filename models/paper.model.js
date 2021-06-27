const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//תכונה למוצר
const paperSchema = new Schema({   

        name: { type: String ,required: true},//חובה
        description: { type: String },
        store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
        quillStyle: { type: String },

        // variation: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variation" }],
        // categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
}, {
        timestamps: true,
});

const Paper = mongoose.model('Paper', paperSchema);

module.exports = Paper;