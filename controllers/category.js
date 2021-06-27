var Category = require('../models/category.model');
var Product = require('../models/product.model');
var CategoryDesign = require('../models/store_design/categoryDesign.model')
var mongoose = require('mongoose')
var Store = require('../models/store.model');
const Request = require('request');
const getAllCategories = (req, res) => {

        Category.find().populate('products').populate({
                path: "categoryDesign",
                populate: { path: "categoryTitle" }
        })
                .then(categories => res.json(categories))
                .catch(err => res.status(400).json('Error: ' + err));
}

const getCategoryById = (req, res) => {
        Category.findById(mongoose.Types.ObjectId(req.params.id))
                .populate({
                        path: "childrenCategory",
                        populate: { path: "products" }
                })
                .populate('products').populate({
                        path: "categoryDesign",
                        populate: { path: "categoryTitle" }
                }).then(category => res.json(category))
                .catch(err => res.status(400).json('Error: ' + err));
}


const newCategory = async (req, res) => {

        const { categoryName,
                categoryDescription,
                image,
                products,
                store,
                color,
                masterCategory,
                slug,
                childrenCategory,
                categoryImage,
                textContent,
                textSize,
                textAlignment,
                display,
                textColor,
                paddingTop,
                statusShow,
                indexInMenu } = req.body;
        const category = new Category({
                categoryName,
                categoryDescription,
                image,
                color,
                products,
                store,
                masterCategory,
                slug,
                childrenCategory
        })

        await category.save().then(async (categoryret) => {

                let cd;
                const options1 = {
                        url: 'https://bullcommerce.shop/api/designs/newCategoryDesign/',
                        method: 'POST',
                        headers: { Authorization: "view" },
                        json: {

                                "categoryData": categoryret._id,
                                "imageCategory": categoryImage,
                                "statusShow": true,
                                "textContent": textContent,
                                "textSize": textSize,
                                "textAlignment": textAlignment,
                                "display": display,
                                "textColor": textColor,
                                "paddingTop": paddingTop,
                                "indexInMenu": indexInMenu
                        }
                };
                Request(options1, (error, response, body) => {
                        if (error)
                                console.error("error!!!!!!!!!!!!!" + error);
                        else {
                                cd = body;
                                categoryret.categoryDesign = body._id
                                categoryret.save().then(console.log("success save " + categoryret.categoryName + " category"))
                                res.status(201).json({
                                        _id: categoryret._id,
                                        categoryName: categoryret.categoryName,
                                        categoryDescription: categoryret.categoryDescription,
                                        masterCategory: categoryret.masterCategory,
                                        childrenCategory: categoryret.childrenCategory,
                                        image: categoryret.image,
                                        color: categoryret.color,
                                        products: categoryret.products,
                                        attributes: categoryret.attributes,
                                        store: categoryret.store,
                                        slug: categoryret.slug,
                                        categoryDesign: cd
                                })
                        }

                })


                Store.findById(mongoose.Types.ObjectId(category.store)).then(
                        stroe => {
                                if (store) {
                                        stroe.categories.push(categoryret._id);
                                        stroe.save().then(s =>
                                                console.log("add " + categoryret.categoryName + " category to " + store.storeName)
                                        )
                                }
                        })
                Category.findById(mongoose.Types.ObjectId(category.masterCategory)).then(async (mc) => {
                        if (mc) {
                                if (Array.isArray(mc.childrenCategory) && mc.childrenCategory.length)
                                        mc.childrenCategory.push(category);
                                else
                                        mc.childrenCategory = new Array(category);
                                mc.save()
                                        .then(m => console.log("save " + category.categoryName + " in his master category " + m.categoryName))
                                        .catch(err => { console.error(err); });
                        }
                }).catch(err => { console.error(err); })
                let c = await Category.findById(mongoose.Types.ObjectId(categoryret._id)).populate('products').populate('categoryDesign');
        })
                .catch((err) => {
                        console.error(err);
                        res.status(400).json({
                                "message:": "erorr"
                        })
                });
}

const editCategory = async (req, res) => {

        const body = req.body;
        try {
                const newCategory = await Category.findByIdAndUpdate(req.params.id, body, { new: true });

                if (newCategory) {
                        console.log("edit " + newCategory.categoryName + " category");
                        res.status(201).json(newCategory)
                }
        }
        catch (err) {
                console.error(err)
                res.status(500).send(err)
        }

}

const deleteCategory = async (req, res) => {

        console.log("category to delete", req.params.id);

        await Category.deleteOne({ "_id": mongoose.Types.ObjectId(req.params.id) }, function (err, obj) {
                if (err) {
                        res.status(500).json(err);
                        throw err;
                }
                console.log("The " + obj.categoryName + " category is deleted");

                Product.deleteMany({ "category": req.params.id }, function (err, obj) {
                        if (err) throw err;
                        console.log("The products in this category deleted");
                })
                res.status(200).json(obj);
        })
}

module.exports = {
        newCategory,
        editCategory,
        deleteCategory,
        getAllCategories,
        getCategoryById
}

