const express = require('express');
//const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
var bodyParser = require('body-parser')
const cors = require('cors');
require('dotenv').config();
const userController = require('./controllers/user');
var User = require('./models/user.model');
const request = require("request");

const app = express();
//app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// app.use(cors());
// app.use(cors({ origin: 'http://localhost:3000' }));

app.all("/*", function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header(
        "Access-Control-Allow-Headers",
        'Content-Type, Authorization, Content-Length, X-Requested-With'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }

});
const uri = process.env.DB_CONNECT2;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
    (err) => { if (err) console.log(JSON.stringify(err)) });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});


//היכולת להתעסק עם קבצים
const fileupload = require('express-fileupload');
app.use(fileupload({ createParentPath: true }))


// const communitiesRouter = require('./routes/communities');
const router = require('./routes/api')
const viewsRouter = require('./routes/views')

app.use('/api', router);




app.use('/:userName/isPermission', userController.checkPermission, async (req, res) => {
    console.log("isPermission????");
    console.log("userName", req.params.userName);
    User.findOne({ username: req.params.userName }).then((currentUser) => {
        console.log("currentUser", currentUser)

        if (!currentUser) {
            let newUser = new User();

            const jwt = req.cookies && req.cookies.jwt ? req.cookies.jwt : req.headers['authorization'] ? req.headers['authorization'] : null
            const cookie = request.cookie(`jwt=${jwt}`)
            console.log("jwt", jwt, "cookie", cookie);
            let urlRoute

            const options = {
                method: "GET",
                url: `https://dev.accounts.codes/api/${req.params.userName}`,
                headers: { Cookie: cookie }
            };
            request(options, async (error, response, body) => {
                console.log("response.statusCode", response.statusCode)
               if (error || response.statusCode != 200) {
                    return res.status(401).json({ des: req.get('host'), routes: urlRoute, status: 401 })
                }
                else {
                    console.log("userName", req.params.userName)
                    newUser.username = req.params.userName;
                    // newUser.email = body.user.email
                    newUser.email = JSON.parse(body).user.email
                    await newUser.save();
                    res.status(200).json(newUser);

                }

            });
        }
        else
            res.status(200).json(currentUser)

    })
});





app.use(express.static(path.join((__dirname, "./build"))));
app.use('/*', viewsRouter)
// app.use('/users', usersRouter);
// app.use('/communities', communitiesRouter);
app.use(show);
function show(req, res, next) {
    console.log('original url: ');
    console.log(req.originalUrl);
    next();
}


// app.set('views', path.join(__dirname, 'views'))


app.listen(3000, () => {
    console.log(`!!Server is running on port 3000`);
});