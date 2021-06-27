var Order = require('../models/order.model');
var User = require('../models/user.model');
var Store = require('../models/store.model');
var Product = require('../models/product.model')
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var request = require('request');
// await Product.findById("5fdf4dd23f9cfbd9d5613bf2").populate({ path: 'category' })
// .then(products => {res.json(products);console.log(products);})
const getAllOrdersOfStore = async (req, res) => {

    Order.find({ store: req.params.storeId }).populate({ path: 'store' }).populate({ path: 'user' }).populate({
        path: 'products',
        populate: {
            path: 'terms',
            model: 'Product'
        }
    })

        .then(orders => res.status(200).json(orders))
        .catch(err => res.status(400).json('Error: ' + err));
}

const getOrderByTrackingId = (req, res) => {
    Order.findOne({ "trackingID": req.params.trackingId })
        .then(order => res.json(order))
        .catch(err => res.status(400).json('Error: ' + err));
}

const newOrder = async (req, res) => {

    const { trackingID, user, userAddress, date, status, store, products, totalPrice } = req.body;

    //חישוב מחיר סופי מגיע מהריאקט
    // let totalPrice = 0;
    // if (products)
    //         await products.forEach(item => {
    //                 var p = Product.findById(mongoose.Types.ObjectId(item.product))
    //                         .then(pr => {
    //                                 totalPrice += (pr.price * item.amount)
    //                         })

    //         })

    const createOrder = new Order({
        trackingID,
        user,
        userAddress,
        date,
        status,
        store,
        products,
        totalPrice
    })
    try {
        let order;
        await createOrder.save().then(o => {
            order = o;
        })
        //לשאול אם יש טעם לאכוף את זה שבנ"א יכול להכניס להזמנה
        //מוצרים שאינם נמצאים בחנות בה הזמין
        //מכיוון שבמילא אנו נציג למשתמש רק את המוצרים מחנות זו
        if (createOrder.products)
            await createOrder.products.forEach(item => {
                // let p;
                Product.findById(item.product._id)
                    .then(async product => {
                        if (product.amount && item.amount && product.amount >= item.amount)
                            product.amount = product.amount - item.amount;
                        await product.save()
                    });
                // p.amount = p.amount - item.amount;
            });
        Store.findById(mongoose.Types.ObjectId(createOrder.store)).then(
            stroe => {
                stroe.storeProducts.push(createOrder);
                stroe.save().then("add to store")
            })

        let store = await Store.findById(createOrder.store._id);
        // let products = await Store.findById(createOrder.product._id);
        if (!store.orders || !Array.isArray(store.orders))
            store.orders = []
        await store.orders.push(createOrder)
        await store.save()
        // console.log(store + "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
        let user = await User.findById(createOrder.user._id);
        console.log("user", user);
        if (user.orders === null || !Array.isArray(user.orders))
            user.orders = []
        await user.orders.push(createOrder);
        await user.save()
        // .then(u=>console.log("save user")).catch(err=>console.log("not save user",err));
        console.log("order", createOrder);
        res.json(createOrder)

        // const mailOptions = {
        //     from: `tehilaz@mails.codes`,
        //     to: 't0527609560@gmail.com',
        //     // to: store.email,
        //     // subject: `Details about order number`,
        //     // html: `<h3>order details:</h3>`
        //     subject: `Details about order number ${order.trackingID}`,
        //     html: `<h3>order details: <br/> Name of order owner: ${user.username}<br/> Residence of the order owner: ${user.userAddress}<br />Order Date: ${order.date}</h3>`
        // };
        // const options = {
        //     url: 'https://mails.codes/mail/sendEmail',
        //     method: 'POST',
        //     headers: { Authorization: "secretKEY@2021" },
        //     json: mailOptions,
        // };
        // return new Promise((resolve, reject) => {
        //     request(options, (error, res, body) => {
        //         if (error) {
        //             console.error("error:" + error);
        //             reject(error);
        //         }
        //         console.log(`statusCode: ${res.statusCode}`);
        //         console.log(body);
        //         console.log("ttttttttttt")
        //         resolve('sent')
        //         console.log("lllllllllllllllll")
        //     });
        // });
    }

    catch (error) {
        console.log("catch err", error);
        res.status(400).json(error);
    }
}

const deleteOrder = async (req, res) => {

    let order2 = await Order.findOne({ "trackingID": req.params.trackingId })
    order2.products.forEach(item => {
        // let p;
        Product.findById(item.product._id)
            .then(async product => {
                if (product.amount && item.amount) {
                    product.amount = product.amount + item.amount;
                    await product.save()
                }
            });

        // p.amount = p.amount - item.amount;
    });

    await Order.deleteOne({ "trackingID": req.params.trackingId }, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        res.status(201).json({
            "messege": "deleted"
        })
    });
}

const changeOrderStatus = async (req, res) => {

    let order2;
    order2 = await Order.findOne({ "trackingID": req.params.trackingId });
    console.log(order2);
    order2.status = req.body.status;
    await order2.save().then(o => {
        res.json(o)
    });
}

const updateOrder = async (req, res) => {
    let ord;
    try {
        //req.params.id את מה שרוצים לשנות
        //req.body במה לשנות
        ord = await Order.updateOne({ "trackingID": req.params.trackingId }, req.body)
        await ord.save().then(o => { res.json(o) })
    }
    catch (err) {
        res.status(500).json({ err: err.massage })
    }
}

module.exports = {
    getAllOrdersOfStore,
    getOrderByTrackingId,
    newOrder,
    deleteOrder,
    changeOrderStatus,
    updateOrder
}