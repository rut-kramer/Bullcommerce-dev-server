const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//קטגורית מוצרים
const categorySchema = new Schema({
        categoryName: { type: String, required: true },//חובה
        categoryDescription: { type: String },
        //קטגורית אב- אופציונאלי
        masterCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
        childrenCategory: [{ type: mongoose.Schema.Types.Object, ref: "Category" }],
        image: { type: String },//אופצינואלי
        color: { type: String, required: true },//חובה
        //בתחילה ריק ומתמלא בהוספת מוצר לקטגוריה זו
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        attributes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attribute" }],
        //חובה!!! לא יכולה להיות קטגוריה באויר required: true
        store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
        //כתובת URL אוטומטי ע"י שם
        slug: { type: String },
        categoryDesign: { type: mongoose.Schema.Types.ObjectId, ref: "CategoryDesign" }

}, { timestamps: true, }



);


// folderSchema.pre('save', async function (next) {
//         try {
//             await User.findByIdAndUpdate(this.userId, { $push: { folders: this._id } })
//             return next();
//         } catch (error) {
//             console.log(error)
//             res.status(400).send(error)
//         }
//     })

//     folderSchema.pre('findOneAndDelete', async function (next) {
//         try {
//             let docToUpdate = await this.model.findOne(this.getQuery());
//             await User.findByIdAndUpdate(docToUpdate.userId, { $pull: { folders: docToUpdate._id } })
//             return next()
//         } catch (error) {
//             console.log('error')
//         }
//     })
const Category = mongoose.model('Category', categorySchema);



module.exports = Category;