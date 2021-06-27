var Store = require('../models/store.model');
var User = require('../models/user.model');
var Product = require('../models/product.model');
var Order = require('../models/order.model');
var Category = require('../models/category.model');
var Attribute = require('../models/attribute.model');
var Term = require('../models/term.model');
var mongoose = require('mongoose');
const Request = require('request');

const getAllStores = (req, res) => {
        Store.find()
                .then(store => res.json(store))
                .catch(err => res.status(400).json('Error: ' + err));
}



const getStoreByStoreName = async (req, res) => {
        await Store.findOne({ "storeName": req.params.name })
                .then(store => res.json(store))
                .catch(err => res.status(400).json('Error: ' + err));
}

const getStoreById = (req, res) => {
        Store.findById(mongoose.Types.ObjectId(req.params.id))
                // .populate({ path: 'storeManager' })
                .then(store => res.json(store))
                .catch(err => res.status(400).json('Error: ' + err));
}
// .then(store => res.json(store))
// .catch(err => res.status(400).json('Error: ' + err));

const newStore = async (req, res) => {

        const { storeName,
                urlRoute,
                storeDescription,
                logo,
                address,
                tel,
                email,
                storeManager,
                storeProducts,
                shipmentYOrNo,
                urlAddress,
                colorDominates,
                policy,
                currency,
                checkInventoryManagement,
                checkoneProductPurchase,
                preOrderYOrNo,
                unitSizeOrLength,
                unitOfWeight } = req.body;
        const store = new Store({
                storeName,
                urlRoute,
                storeDescription,
                logo: "https://files.codes/uploads/Yeudit/img/1623570171008__furnitureLogo.png",
                address,
                tel,
                email,
                storeManager,
                storeProducts,
                shipmentYOrNo,
                urlAddress,
                colorDominates,
                policy,
                currency,
                checkInventoryManagement,
                checkoneProductPurchase,
                preOrderYOrNo,
                unitSizeOrLength,
                unitOfWeight
        })
        await store.save().then(async (s) => {
                User.findById(storeManager).then(async (u) => {
                        await u.stores.push(store._id);
                        await u.save();
                        var newCategoryId = ""; var options9 = "";
                        const options10 = {
                                url: 'https://bullcommerce.shop/api/attributes/newAttribute',
                                method: 'POST',
                                headers: { Authorization: "view" },
                                json: {

                                        "name": "Color",
                                        "store": s._id,
                                        "slug": "12345",
                                        "terms": [{
                                                "name": "Yellow",
                                                "description": "summer"
                                        },
                                        {
                                                "name": "Black",
                                                "description": "wedding"
                                        },
                                        {
                                                "name": "Grey",
                                                "description": "fly"
                                        },
                                        {
                                                "name": "Blue",
                                                "description": "fall"
                                        }]
                                }
                        };
                        Request(options10, (error, response, colorAttribute) => {
                                if (error)
                                        console.error("failed to create new attribute ", error);
                                else {
                                        console.log("colorAttribute", colorAttribute)
                                        options11 = {
                                                url: 'https://bullcommerce.shop/api/attributes/newAttribute',
                                                method: 'POST',
                                                headers: { Authorization: "view" },
                                                json: {


                                                        "name": "Material",
                                                        "store": s._id,
                                                        "slug": "12345",
                                                        "terms": [{
                                                                "name": "Wood",
                                                                "description": "warm"
                                                        },
                                                        {
                                                                "name": "Metal",
                                                                "description": "strong"
                                                        },
                                                        {
                                                                "name": "Fabric",
                                                                "description": "pleasant"
                                                        },
                                                        {
                                                                "name": "Rubber",
                                                                "description": "fall"
                                                        }]
                                                }
                                        };
                                        Request(options11, (error, response, materialAttribute) => {
                                                if (error)
                                                        console.error("failed to create new product ", error);
                                                else {
                                                        console.log("materialAttribute", materialAttribute)
                                                        const options = {
                                                                url: 'https://bullcommerce.shop/api/categories/newCategoty',
                                                                method: 'POST',
                                                                headers: { Authorization: "view" },
                                                                json: {
                                                                        "categoryName": "LIVING ROOM",
                                                                        "image": "",
                                                                        "color": "red",
                                                                        "store": store._id,
                                                                        "categoryImage": "https://files.codes/uploads/Yeudit/img/1620122305388__1531.jpg",
                                                                        "textContent": "LIVING ROOM"
                                                                }
                                                        };
                                                        Request(options, (error, response, body) => {
                                                                if (error)
                                                                        console.error("failed to create new category ", error);
                                                                else {
                                                                        newCategoryId = body._id
                                                                        options9 = {
                                                                                url: 'https://bullcommerce.shop/api/products/newProduct',
                                                                                method: 'POST',
                                                                                headers: { Authorization: "view" },
                                                                                json: {
                                                                                        "name": "Chair",
                                                                                        "description": "The Best Product ",
                                                                                        "SKU": "111",
                                                                                        "category": newCategoryId,
                                                                                        "featured": true,
                                                                                        "store": store._id,
                                                                                        "price": "570",
                                                                                        "image": "https://files.codes/uploads/yeudit/img/1617871162135__ia_300000006.png",
                                                                                        "attributes": [{
                                                                                                "attribute": colorAttribute._id,
                                                                                                "terms": [
                                                                                                        colorAttribute.terms[0]._id,
                                                                                                        colorAttribute.terms[1]._id
                                                                                                ]
                                                                                        }, {
                                                                                                "attribute": materialAttribute._id,
                                                                                                "terms": [
                                                                                                        materialAttribute.terms[0]._id]
                                                                                        }]
                                                                                }
                                                                        };
                                                                        Request(options9, (error, response, body) => {
                                                                                if (error)
                                                                                        console.error("failed to create new product ", error);
                                                                                else {
                                                                                        console.log('succes to create new product ', body)
                                                                                }
                                                                        })
                                                                }
                                                        })
                                                        const options1 = {
                                                                url: 'https://bullcommerce.shop/api/categories/newCategoty',
                                                                method: 'POST',
                                                                headers: { Authorization: "view" },
                                                                json: {
                                                                        "categoryName": "DINING ROOM",
                                                                        "image": "",
                                                                        "color": "blue",
                                                                        "store": store._id,
                                                                        "categoryImage": "https://files.codes/uploads/Yeudit/img/1620036025398__interior-shot-of-a-modern-house-dining-room-with-art-on-the-wall.jpg",
                                                                        "textContent": "DINING ROOM"
                                                                }
                                                        };
                                                        Request(options1, (error, response, body) => {
                                                                if (error)
                                                                        console.error("failed to create new category ", error);
                                                                else {
                                                                        newCategoryId = body._id
                                                                        options9 = {
                                                                                url: 'https://bullcommerce.shop/api/products/newProduct',
                                                                                method: 'POST',
                                                                                headers: { Authorization: "view" },
                                                                                json: {
                                                                                        "name": "Sofa",
                                                                                        "description": "The Best Product ",
                                                                                        "SKU": "222",
                                                                                        "category": newCategoryId,
                                                                                        "featured": true,
                                                                                        "store": store._id,
                                                                                        "price": "2600",
                                                                                        "image": "https://files.codes/uploads/yeudit/img/1617871239861__3157828-so-squ-1@2x.png",
                                                                                        "attributes": [{
                                                                                                "attribute": colorAttribute._id,
                                                                                                "terms": [
                                                                                                        colorAttribute.terms[2]._id,
                                                                                                        colorAttribute.terms[3]._id
                                                                                                ]
                                                                                        }, {
                                                                                                "attribute": materialAttribute._id,
                                                                                                "terms": [
                                                                                                        materialAttribute.terms[3]._id,
                                                                                                        materialAttribute.terms[1]._id
                                                                                                ]
                                                                                        }]
                                                                                }
                                                                        };
                                                                        Request(options9, (error, response, body) => {
                                                                                if (error)
                                                                                        console.error("failed to create new product ", error);
                                                                                else {
                                                                                        console.log('sccess to create new product ', body)
                                                                                }
                                                                        })
                                                                }
                                                        })
                                                        const options2 = {
                                                                url: 'https://bullcommerce.shop/api/categories/newCategoty',
                                                                method: 'POST',
                                                                headers: { Authorization: "view" },
                                                                json: {
                                                                        "categoryName": "BED ROOM",
                                                                        "image": "",
                                                                        "color": "yellow",
                                                                        "store": store._id,
                                                                        "categoryImage": "https://files.codes/uploads/Yeudit/img/1620036106063__437.jpg",
                                                                        "textContent": "BED ROOM"
                                                                }
                                                        };
                                                        Request(options2, (error, response, body) => {
                                                                if (error)
                                                                        console.error("failed to create new category ", error);
                                                                else {
                                                                        newCategoryId = body._id
                                                                        const options9 = {
                                                                                url: 'https://bullcommerce.shop/api/products/newProduct',
                                                                                method: 'POST',
                                                                                headers: { Authorization: "view" },
                                                                                json: {
                                                                                        "name": "Table",
                                                                                        "description": "The Best Product ",
                                                                                        "SKU": "333",
                                                                                        "category": newCategoryId,
                                                                                        "featured": true,
                                                                                        "store": store._id,
                                                                                        "price": "3800",
                                                                                        "image": "https://files.codes/uploads/yeudit/img/1617871080623__ia_100000024.png",
                                                                                        "attributes": [{
                                                                                                "attribute": colorAttribute._id,
                                                                                                "terms": [
                                                                                                        colorAttribute.terms[3]._id
                                                                                                ]
                                                                                        }, {
                                                                                                "attribute": materialAttribute._id,
                                                                                                "terms": [
                                                                                                        materialAttribute.terms[3]._id,
                                                                                                        materialAttribute.terms[1]._id,
                                                                                                        materialAttribute.terms[0]._id
                                                                                                ]
                                                                                        }]
                                                                                }
                                                                        };
                                                                        Request(options9, (error, response, body) => {
                                                                                if (error)
                                                                                        console.error("failed to create new product ", error);
                                                                                else {
                                                                                        console.log('sccess to create new product option 9', body);

                                                                                }
                                                                        })
                                                                }
                                                        })
                                                }

                                        })
                                }
                        });
                        const options123 = {
                                url: 'https://bullcommerce.shop/api/designs/newStoreNavbarDesign/',
                                method: 'POST',
                                headers: { Authorization: "view" },
                                json: {
                                        "store": store._id,
                                        "backgroundColor": "",
                                        "textColor": "#888888",
                                        "activeTextColor": "#F29544"
                                }
                        };
                        Request(options123, (error, response, body) => {
                                if (error)
                                        console.error("failed to create the store navbar design ", error);
                                else {
                                        console.log('success create newStoreNavbarDesign', body);
                                }
                        });
                        const options122 = {
                                url: 'https://bullcommerce.shop/api/designs/newStoreNewsletterDesign/',
                                method: 'POST',
                                headers: { Authorization: "view" },
                                json: {
                                        "store": store._id,
                                        "image": "https://files.codes/uploads/Yeudit/img/1622620301558__3.jpg",
                                        "title": "Newsletter",
                                        "subTitle": "Sign up to receive news and updates along with 15% off your first order",
                                        "textboxColor": ""
                                }
                        };
                        Request(options122, (error, response, body) => {
                                if (error)
                                        console.error("failed to create the store navbar design ", error);
                                else {
                                        console.log('success create newStoreNavbarDesign', body);
                                }
                        })
                })
                res.json(store)
        })
                .catch(err => res.status(400).json('Error: ' + err));
}

const editStore = (req, res) => {
        Store.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((s) => {
                console.log("updated " + s.storeName + " successfully");
                res.json(s);
        }).catch(error => {
                console.error('err update Store', error);
                res.status(500).json(error);
        })
}

const deleteStore = async (req, res) => {

        Store.findById(req.params.id).then((store) => {

                // User.findById(store.storeManager).then((user) => {
                //         user.stores.pull(store);
                // }).catch((e) => res.status(400).json('Error: ' + e));
                User.updateOne({ _id: store.storeManager },
                        { $pull: { stores: store._id } }).then((user) => {
                                console.log("user after pulling store", user);
                        });

                Product.deleteMany({ store: store._id }).then((p) => {
                        console.log("The Products in this store are deleted", p);
                        res.json(p);
                }).catch((e) => res.status(400).json('Error: ' + e));

                Order.deleteMany({ store: store._id }).then((o) => {
                        console.log("The orders in this store are deleted", o);
                }).catch((e) => res.status(400).json('Error: ' + e));

                Category.deleteMany({ store: store._id }).then((c) => {
                        console.log("The categories in this store are deleted", c);
                }).catch((e) => res.status(400).json('Error: ' + e));

                Attribute.deleteMany({ store: store._id }).then((a) => {
                        console.log("The attributes in this store are deleted", a);
                }).catch((e) => res.status(400).json('Error: ' + e));

        });
        await Store.deleteOne({ "_id": req.params.id }, function (err, obj) {
                if (err) throw err;
                console.log("Your store has been deleted");
                res.json(obj)
        });
}

const categoriesByStore = (req, res) => {
        Store.findById(req.params.storeId).populate({
                path: 'categories',
                populate: {
                        path: 'products',
                        populate: {
                                path: 'attributes',
                                populate: {
                                        path: 'attribute'
                                }
                        }
                }
        }).populate({
                path: 'categories',
                populate: {
                        path: 'products',
                        populate: {
                                path: 'attributes',
                                populate: {
                                        path: 'terms'
                                }
                        }
                }
        }).populate({
                path: 'categories',
                populate: {
                        path: 'categoryDesign',
                        populate: {
                                path: 'categoryTitle'
                        }
                }
        }).then((s) => {
                if (s.categories) {
                        console.log("store with categories", s);
                        res.json(s.categories);
                }
        });
}

const ordersByStore = (req, res) => {
        Store.findById(req.params.storeId).populate({
                path: 'orders',
                populate: {
                        path: 'products',
                        populate: {
                                path: 'product',
                                model: 'Product'
                        }
                }
        }).populate({
                path: 'orders',
                populate: {
                        path: 'user',

                }
        }).then((s) => {
                console.log("store with categories", s);
                res.json(s.orders);
        });
}

const attributesByStore = (req, res) => {
        console.log("store with attributeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
        Store.findById(req.params.storeId).populate({
                path: 'attributes',
                populate: {
                        path: 'attribute',
                }
        }).populate({
                path: 'attributes',
                populate: {
                        path: 'terms',
                }
        }).then((s) => {
                console.log("store with attributeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", s.attributes);
                res.json(s.attributes);
        });
}



module.exports = {
        newStore,
        editStore,
        deleteStore,
        getAllStores,

        getStoreByStoreName,
        getStoreById,
        categoriesByStore,
        ordersByStore,
        attributesByStore
}

