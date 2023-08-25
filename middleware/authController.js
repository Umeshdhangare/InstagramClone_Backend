const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const generateToken = require("../utils/generateToken");
const User = require('../models/user');
const secretKey = require("../utils/keys");

const signup = async (req, res) => {
    try {
        const data = req.body;
        const {username, password, email} = data;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const createduser = new User({
            username: username,
            password: hashedPassword,
            email: email
        });
        const saveuser = await createduser.save();
        res.status(200).send({
            status: "success",
            message: "user saved successfully",
            data: {
                user: username
            }
        })
    } catch(e) {
        res.status(500).send({
            status:"failure",
            message: e.message
        });
    }
}

const login = async (req,res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username: username});
        if(!user){
            return res.status(401).send({
                status: "failure",
                message:"user does not exist"
            })
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(401).send({
                status: "failure",
                message:"password is incorrect"
            })
        }

        const accessToken = generateToken.generateAccessToken(user);
        const refreshToken = generateToken.generateRefreshToken(user);

        await User.findByIdAndUpdate(user._id, {
            jwtToken: accessToken
        });

        const {jwtToken, password: newpass, ...other } = user._doc;
        res.status(200).send({
            status:"sucsess",
            message:"logged in successfully",
            data: other,
            accessToken,
            refreshToken
        });
    } catch(e) {
        res.status(500).send({
            status:"failure",
            message: e.message
        });
    }
}

const logout = async (req,res) => {
    try {

        const { refreshToken } = req.body;
        if(refreshToken){
            await User.findOne({jwtToken: refreshToken}, [
                {$unset: ["jwtToken"]},
            ]);
            res.status(200).send({
                status:"success",
                message:"You've been logged out"
            });
        }
        else{
            return res.status(400).send({
                status:"failure",
                message:"logout error"
            });
        }
    } catch(e) {
        res.status(500).send({
            status:"failure",
            message: e.message
        })
    }
}

const verify = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.status(403).json("You are not autherized");
    }
    const token = authHeader.split(" ")[1];
    try {
        jwt.verify(token, secretKey.accessKey, (err, user) => {
            if(err){
                throw new Error("Token is not valid!");
            }
            req.user = user;
            next();
        })
    } catch(e) {
        res.status(500).send({
            status:"failure",
            message: e.message
        })
    }
}

module.exports = {
    signup,
    login,
    logout,
    verify
};