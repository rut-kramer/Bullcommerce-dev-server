const dotenv = require('dotenv');
const firebase = require('firebase');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const path = require('path')
const mongoose = require('mongoose')
const User = require('../models/user.model')
const request = require('request');
const requestIp = require('request-ip');





var firebaseConfig = {
    apiKey: "AIzaSyAzoqErXd51jGgfNiKqQAGRDqdg0sGsrSw",
    authDomain: "my-firebase-7374b.firebaseapp.com",
    databaseURL: "https://my-firebase-7374b.firebaseio.com",
    projectId: "my-firebase-7374b",
    storageBucket: "my-firebase-7374b.appspot.com",
    messagingSenderId: "917518837191",
    appId: "1:917518837191:web:c0d3d1ac725ed44cece5e2",
    measurementId: "G-MJWH5ERXWQ"
};
firebase.initializeApp(firebaseConfig);
admin.initializeApp(firebaseConfig);

let uid;
let email;
let ip;
let accessToken;
let jsonWebToken
let numSessions = 0;
let usernameToCheck
let username;
let decoded;
let password;

const insertIfExsist = async (userEmail) => {
    return new Promise(async (resolve, reject) => {

        await User.find({ email: userEmail }, async (err, users) => {
            if (users.length) {
                console.log("users result", users);
                resolve({ message: 'user exists' });
                numSessions++;
                return;
            }
            console.log("user===3: ", username);
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: userEmail,
                uid: uid,
                username: username
            })
            _id = user._id
            console.log("new user", user);
            let success = await user.save();
            if (success) {

                resolve({ message: 'user added successfully' });
            }
        })
    })

}


const varify = (req, res, next) => {
    return new Promise((resolve, reject) => {
        let token = (typeof req === "object") ? req.body.token : req
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded) reject("access deiend")
        console.log("decoded " + JSON.stringify(decoded));
        resolve(decoded)
    })
}

const createLeaderJwt = (req, res) => {
    const clientIp = requestIp.getClientIp(req);
    accessToken = jwt.sign({ uid: uid, email: email, ip: clientIp }, process.env.ACCESS_TOKEN_SECRET);
    console.log("accessToken ", accessToken);
}

const checkPremission = async (req, res) => {
    console.log("req.body----2", req.body);
    username = req.params.username;
    varify(req).then((decodedToken) => {
        console.log("decodedToken", decodedToken);
        uid = decodedToken.uid
        email = decodedToken.email
        console.log("decodedToken.nameeeeeee:", username);
        // ip = decodedToken.ip
    }).catch((err) => console.log("my error! ", err))
    console.log("before username check", username)
    try {
        console.log("decodes details " + uid + " " + email + " " + username)
        insertIfExsist(email).then(async (result) => {
            if (result.message) {
                console.log("inside if " + result.message)
                // const usernamePresent = await usernameExistCheck(uid)
                // console.log("usernamePresent " + usernamePresent)
                console.log("inside if " + username)
                jsonWebToken = req.headers["authorization"]
                console.log("check ", username);
                return res.status(200).json({
                    "jwt": jsonWebToken,
                    "uid": uid,
                    "redirectUrl": req.redirectUrl,
                    // "is_username": usernamePresent,
                    "username": username,
                    "email": email
                })
            }
        }).catch((err) => {
            res.status(500).send(err)

        })
    }
    catch (err) {
        res.status(500).send(err)
    }
}


const usernameExistCheck = async (uid) => {
    console.log(uid, "+++++++++")
    return new Promise(async (s, j) => {
        await User.find({ uid: uid }, (err, $) => {
            console.log("its user", $)
            if ($.length) {
                if ($[0].username == "") {
                    username = ""
                    s(false)
                }
                else {
                    username = $[0].username
                    s(true)
                }
            }
            else {
                j("temporary error, please try again later.")
            }
            // const r = $.username ? true : false
            // s(r);
        })
    })
    // return new Promise(async(s, j) => {
    //   User.find({ uid: uid, username: {$exists: true} }, (err, $) => { 
    //         if($)
    //        {console.log("+++++",$,$.username)
    //            username= $.username
    //            const r=  $.username==""? true : false
    //            s(r)
    //         }
    //        else{
    //            username=""
    //        }
    //        // const r = $.username? true : false
    //         s(false);
    //     })
    // })
}
const usernameExistCheck2 = (uid) => {

}

const usernameCheck = async (req, res) => {
    usernameToCheck = req.body.usernameToCheck
    const decodedToken = await varify(req)
    const uid = decodedToken.uid
    User.find({ username: usernameToCheck }, async (err, users) => {
        if (users.length) {
            return res.json({ availability: false, username: usernameToCheck })
        }

        User.findOneAndUpdate({ 'uid': uid }, { 'username': usernameToCheck }, { upsert: true }, function (err, doc) {
            if (err) return res.json({ error: err });
            else {
                sendWelcomeEmail(uid)
                return res.json({ availability: true, uid: uid, username: usernameToCheck })
            }
        });

        // User.update({'uid' : uid},{'username' : usernameToCheck})
        // res.json({availability: true})
    })
}
const sendWelcomeEmail = async (uid) => {
    // const jwt = req.headers.authentication;
    // console.log("jwt", jwt);
    const Cuser = await User.findOne({ uid: uid });
    // const username = 'chavi'
    const conversation = { subject: 'thank you for choosing leader codes' }
    const wave = {
        //  body: '<h1>hi ' + username + '</h1>' +
        body: '<h1>hi ' + usernameToCheck + '</h1>' +
            '<h2> thank you for choosing leader, you can click ' + '<a href="https://leader.codes/login#">here </a> to login to you account </h2>' +

            '<h2> -leader.codes- </h2>'
    };
    const from = "NoReplay"
    const sendEmailToUser = true;
    request.post('https://box.leader.codes/api/' + Cuser.uid + '/conversation/saveConversationGlobal', {
        json: { conversation, wave, sendEmailToUser, from },
        headers: { authentication: jsonWebToken }
    }, (error, res, body) => {
        console.log("arrive to saveConversationGlobal");

        if (error) {
            console.error(error)
            return
        }

    })
}
const getToken = (req, res) => {
    console.log("getToken register");

    console.log("register req.token: " + req.body.jwt);
    // console.log("req.username",req.body.username);
    // username=req.body.username;

    admin.auth().verifyIdToken(req.body.jwt)
        .then(function (decodedToken) {
            console.log("decodedToken ", decodedToken);
            var token = req.body.jwt
            uid = decodedToken.uid;
            // console.log("uidddd ",decoded.uid);
            email = decodedToken.email;
            createLeaderJwt(req, res);
            console.log("after create jwt");
            console.log("access token " + accessToken)
            res.setHeader('Set-Cookie', `accessToken=${accessToken}; HttpOnly`, 'domain = leader.codes');
            return res.status(200).json({
                accessToken
                //email
            })
        }).catch(function (error) {
            console.log("error: " + error)
            res.status(500)
        });
}

const getUidFromToken = async (token) => {
    const decodedToken = await varify(token)
    const uid = decodedToken.uid
    return uid
}

module.exports = {
    getToken,
    checkPremission,
    usernameCheck,
    getUidFromToken,
    usernameExistCheck
}