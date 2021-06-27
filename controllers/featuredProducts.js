var featuredProducts = require('../models/featuredProducts.model');
var mongoose = require('mongoose');

const getAllfeaturedProducts = (req, res) => {
    featuredProducts.find()
                .then(featuredProducts => res.json(featuredProducts))
                .catch(err => res.status(400).json('Error: ' + err));
}

const getfeaturedProductsById = (req, res) => {
    featuredProducts.findById(mongoose.Types.ObjectId(req.params.id))
                .then(featuredProducts => res.json(featuredProducts))
                .catch(err => res.status(400).json('Error: ' + err));
}

const newfeaturedProducts = async (req, res) => {

        const {  product,
            description,
            priceAfterDiscount,
            startDate,
            endDate,
            store, } = req.body;
        const featuredProducts = new featuredProducts({
            product,
            description,
            priceAfterDiscount,
            startDate,
            endDate,
            store,
        })
        await featuredProducts.save().then(() => {
                console.log(featuredProducts)
                return res.status(201).json({
                    featuredProducts
                })
        })
                .catch(console.log("can't create new featuredProducts"));
}

const editfeaturedProducts = async (req, res) => {

        await featuredProducts.updateOne({ _id: req.params.id }, req.body).then(() => {
                console.log('update featuredProducts!!')
                return res.status(201).json({
                        "messege": "update featuredProducts"
                })
        }).catch(error => {
                console.log('err 500 update featuredProducts')
        })

}

const deletefeaturedProducts = async (req, res) => {

        await featuredProducts.deleteOne({ "_id": req.params.id }, function (err, obj) {
                if (err) throw err;
                console.log("1 document deleted");
        });
}

module.exports = {
        newfeaturedProducts,
        editfeaturedProducts,
        deletefeaturedProducts,
        getAllfeaturedProducts,
        getfeaturedProductsById
}

