var Product = require('../models/product.model');
var Category = require('../models/category.model');
var Attribute = require('../models/attribute.model');
var Store = require('../models/store.model');
var Term = require('../models/term.model');
var mongoose = require('mongoose');


// var attributeController = require('../controllers/attribute');

const getAllProducts = async (req, res) => {
        Product.find()
                .populate('category')
                .populate({
                        path: "attributes",
                        populate: {
                                path: "terms"
                        }
                })
                .populate({
                        path: "attributes",
                        populate: {
                                path: "attribute"
                        }
                })
                .populate("attributes")
                .then(products => res.json(products))
                .catch(err => res.status(400).json('Error: ' + err));
}
const getProductById = (req, res) => {
        Product.findById(mongoose.Types.ObjectId(req.params.id))
                // .populate({ path: 'attributes' })
                .populate({
                        path: "attributes",
                        populate: {
                                path: "terms"
                        }
                })
                .populate({
                        path: "attributes",
                        populate: {
                                path: "attribute"
                        }
                })
                .then(product => res.json(product))
                .catch(err => res.status(400).json('Error: ' + err));
}

// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';


// bcrypt.genSalt(saltRounds, function (err, salt) {
//         bcrypt.hash(myPlaintextPassword, salt, async function (err, hash) {
//                 console.log("hash", hash
//                         // , uid
//                 );
//         })
// })



const newProduct = async (req, res) => {
        console.log("1", req.body)
        console.log("inside product");
        const { name,
                description,
                amount,
                SKU,
                category,
                store,
                price,
                image,
                attributes,
                featured,
                // variations 
                salePrice,
                photoGallery,
                video,
                isStock,
                isDraft,
                weight,


        } = req.body;

        let product = new Product({
                "name": name,
                "description": description,
                "amount": amount,
                "SKU": SKU,
                "category": category,
                "store": store,
                "price": price,
                "image": image,
                "attributes": attributes,
                "featured": featured,

                "salePrice": salePrice,
                "photoGallery": photoGallery,
                "video": video,
                "isStock": isStock,
                "isDraft": isDraft,
                "weight": weight,
        })


        await product.save().then(async (p) => {
                let pr

                console.log("newProduct", pr);

                Category.findById(mongoose.Types.ObjectId(p.category)).then(
                        (category) => {
                                if (category) {
                                        console.log("cccccccccategory" + category.categoryName)
                                        // if (Array.isArray(category.products) && category.products.length)
                                        category.products.push(p._id);
                                        // else
                                        //         category.products = new Array(p._id);
                                        category.save().then(console.log("add to category"))
                                }
                        })

                Store.findById(mongoose.Types.ObjectId(p.store)).then(
                        (s) => {
                                if (s) {
                                        console.log("ssssstttt", s);
                                        // if (Array.isArray(s.storeProducts) && s.storeProducts.length > 0)
                                        s.storeProducts.push(p);
                                        // else
                                        //         s.storeProducts = new Array(p);
                                        s.save().then("add to category")
                                }
                        })
                // if (Array.isArray(attributes) && attributes.length > 0)
                //         attributes.forEach(async attribute => {
                //                 let gg = await Attribute.findById(attribute);
                //                 if (gg) {
                //                         gg ? console.log("gg", gg) : "";
                //                         gg.products.push(p)
                //                         gg.save()
                //                 }
                //         })
                ////here
                if (Array.isArray(p.attributes) && p.attributes.length > 0) {
                        p.attributes.forEach(at => {
                                Attribute.findById(mongoose.Types.ObjectId(at.attribute)).then(async atr => {
                                        console.log("aaaatttrrrriii", atr);
                                        if (Array.isArray(atr.products) && atr.products.length)
                                                atr.products.push(p);
                                        else
                                                atr.products = new Array(p);
                                        await atr.save().then("add to category")

                                }).catch((err) => { console.log(err); })

                        })
                }
                // 
                pr = await Product.findById(p._id).populate('category')
                        .populate({
                                path: "attributes",
                                populate: {
                                        path: "terms"
                                }
                        })
                        .populate({
                                path: "attributes",
                                populate: {
                                        path: "attribute"
                                }
                        })

                res.json(pr)

        }).catch((error) => {
                console.log("can't create new product", error);
                res.status(400).json(error)
        }
        );

}



const updateUser = async (req, res) => {
        let user;
        try {
                user = await User.findByIdAndUpdate(req.params.id, req.body)
                await user.save()
                res.send("the user is update")
        }
        catch (err) {
                res.status(500).json({ err: err.massage })
        }
}
const editProduct = async (req, res) => {
        let p;
        try {
                console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU")
                //req.params.id את מה שרוצים לשנות
                //req.body במה לשנות
                console.log("bbb", req.body)
                p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('category')

                // await Product.save().then(p=>
                //         res.status(200).json(p) 
                //         console.log("update"); 
                // )


                if (p) {
                        console.log("new: ", p)
                        res.status(200).send(p)


                }


        }
        catch (err) {
                res.status(500).json({ err: err })
                console.log("----");
        }
}

const deleteProduct = async (req, res) => {
        await Product.deleteOne({ "_id": req.params.id }, function (err, obj) {
                if (err) throw err;
                console.log("1 document deleted");
                res.status(201).json({
                        "messege": "deleted"
                })
        });
}

const getProductsByCategory = async (req, res) => {

        await Category.findById(req.params.categoryId).populate("products")
                .then(c => {
                        res.json(c.products)
                });
}

module.exports = {
        newProduct,
        editProduct,
        deleteProduct,
        getAllProducts,
        getProductById,
        getProductsByCategory
}

