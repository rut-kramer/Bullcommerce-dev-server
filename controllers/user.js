var User = require('../models/user.model');
var Store = require('../models/store.model');
var Category = require('../models/category.model');
var mongoose = require('mongoose');
const request = require('request');



const getAllUsers = (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
}

const getUserByEmail = (req, res) => {
    User.find({ "email": req.params.email })
        .populate("stores")
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
}

const getUserByEmailAndPassword = (req, res) => {
    User.find({ "email": req.params.email, "password": req.params.password })
        .populate("stores")
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
}

const newUser = async (req, res) => {

    const { username, password, email } = req.body;
   let uu= User.find({ "email": req.params.email })
console.log("iiiiii",uu);
if (uu==undefined) {
    const newsUser = new User({
        username: username,
        password: password,
        email: email
    })
    newUser.save().then(n => {
        console.log("News user created", n);

        res.status(200).json({
            _id: n._id,
            username: n.userName,
            password: n.password,
            email: n.email,
            
        })
    }
    ).catch((error) => {
        console.error("cant create new user", error);
        res.status(400).json(error)

    })
    
} else {
    console.log("user alredy exists");
    res.status(400).json("user alredy exists")
}
}


const getUserByUid = async (req, res) => {
    await User.findOne({ "uid": req.params.uid }, function (err, result) {
        if (err) throw err;
        res.send(result._id)
    })
}

const editUser = async (req, res) => {
    await User.updateOne({ _id: req.params.userId }, req.body).then((u) => {
        console.log('update user!!', u);
        return res.status(201).json(u)
    }).catch(error => {
        console.error('err update user')
    })

}

const getStoresOfUser = async (req, res) => {
    Store.find({ "storeManager": req.params.userId })
        .populate("categories")
        .populate("storeProducts")
        .populate("orders")
        // .populate({
        //     path: 'orders',
        //     populate: {
        //         path: 'products',
        //         populate: {
        //             path: 'product',
        //             model: 'Product',
        //             populate: {
        //                 path: 'user',
        //                 model: 'User'
        //             }
        //         }
        //     }
        // })
        .then(s => {
            res.json(s)
        })
}

//שליפת החנות שעודכנה אחרונה של יוזר עם פופולייט
const latestStoreOfUser = async (req, res) => {

    let userStores = await Store.find({ storeManager: req.params.userId })
        .sort({ updatedAt: -1 })
        .limit(1)
        .populate({
            path: "storeProducts",
            populate: {
                path: "categories"
            }
        })
        .populate({
            path: "categories",
            populate: {
                path: "storeProducts"
            }
        })
        .populate({
            path: "orders",
            populate: {
                path: "products"
            }
        })
        .then((st) => {
            console.log("latest store", st);
            res.json(st);
        })
        .catch((e) => res.status(400).json('Error: ' + e));
}


const checkPermission = async (req, res, next) => {
    //בפונ הזו אמור לבדוק אם השם משתמש והגדט תואמים לאקאונטס
    const host = req.get('host');
    const isLocal = (req.query.isLocal == 'true');
    console.log("IsLocal?", isLocal, "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    if (isLocal)
        return next();
    console.log("in checkPermission", req.originalUrl.split("/"));
    let userName = req.originalUrl.split("/")[1];
    let apiFlag = false
    let urlRoute
    let redirectUrl = host;
    if (userName == "api") {
        userName = req.originalUrl.split("/")[2];
        apiFlag = true
    }
    //incorrect if:  ?
    if (!apiFlag) urlRoute = req.originalUrl.split("/")[3]
    // needless if!!!!!!!!!!!
    if (!userName) {
        console.log("no uid");
        return res.status(401).json({ des: redirectUrl, routes: urlRoute, apiFlag: apiFlag, status: 401 })
    }
    else {
        console.log("cookies", req.cookies);
        const jwt = req.cookies && req.cookies.jwt ? req.cookies.jwt : req.headers['authorization'] ? req.headers['authorization'] : null
        console.log("jwt", jwt);
        const cookie = request.cookie(`jwt=${jwt}`)
        // const cookie = "request.cookie(`jwt=${jwt}`)"
        console.log("cookies", cookie)
        const options = {
            method: "GET",
            url: `https://dev.accounts.codes/isPermission/${userName}`,
            headers: { Cookie: cookie }
        };
        request(options, (error, response, body) => {
            console.log("response.statusCode", response.statusCode)
            console.log("body", typeof (body), body)
            if (error || response.statusCode != 200) {
                return res.status(401).json({ des: redirectUrl, routes: urlRoute, apiFlag: apiFlag, status: 401 })
            }
            else {
                console.log("userName", userName)
                if (body == 'true') {
                    console.log("no error!!!!!!!");
                    return next();
                }
                return res.status(401).json({ des: redirectUrl, routes: urlRoute, apiFlag: apiFlag, status: 401 })
            }
        });
    }
};
module.exports = {
    getAllUsers,
    getUserByEmail,
    getUserByEmailAndPassword,
    newUser,
    getUserByUid,
    getStoresOfUser,
    editUser,
    checkPermission,
    latestStoreOfUser
}


