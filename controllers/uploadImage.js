
const path = require('path')
var request = require('request');
var User = require('../models/user.model')
var Store = require('../models/store.model')



const uploadImage = async (req, res) => {
        // console.log("&&&&&&&&&&&&&&&&&&&&")
        console.log("wwwwwwwwwwwwwwwwwwww", req.files)
        // console.log("ffffff", req.files.file)
        // console.log(req.params.uId)
        let user = await User.findOne({ "uid": req.params.uid })

        let username = user.username;
        // console.log("uId", uId);
        console.log("req.headers", req.headers["authorization"]);
        let url = await uploadedFile(req.files.file, username, req.params.uid, req.headers["authorization"]);
        console.log("url", url);
        // user.profilePicture = url;
        // await user.save().then(u => {
        //         console.log(u);
        // });
        res.send(url);
}

uploadedFile = (fileToUpload, userName, uId, headers) => {
        // console.log("headers", headers);
        return new Promise(async (resolve, reject) => {
                // console.log(fileToUpload);
                // console.log("uploadedFile");
                const uri = `https://files.codes/api/${userName}/upload`;
                // console.log(uri);
                const options = {
                        method: "POST",
                        url: uri,
                        headers: {
                                Authorization: headers,
                                "Content-Type": "multipart/form-data",
                        },
                        formData: {
                                file: {
                                        value: fileToUpload.data,
                                        options: {
                                                filename: fileToUpload.name,
                                        },
                                },
                        },
                };

                request(options, async (err, res, body) => {
                        if (err) {
                                // console.log(err);
                                reject(err);
                        }
                        let url = "vhhg";
                        // console.log("result from server", body);
                        try {
                                console.log("body", body);
                                // url = JSON.parse(body).data.url;
                                // let url=body.data.url;
                                resolve(url);
                        } catch (error) {
                                reject(error);
                        }
                });
        });
};

module.exports = {
        uploadImage,
        // uploadedFile
}
