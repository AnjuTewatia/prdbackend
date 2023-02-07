const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY;
const express = require("express");
const Product = require("../Product/product.model");
const Cart = require("./cart.model")
const User = require("../Auth/user.model")


const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    try {
        if (!token) {
            return res.send("Token is required")
        } else {
            let decode = jwt.verify(token, SECRET_KEY);
            let user = await User.findOne({ email: decode.email });
            if (!user) {
                return res.send(" User Not Found..!")
            } else {
                req._id = user._id;
                next()
            }
        }
    } catch (error) {
        return res.send(error.message)
    }
}
module.exports = { authMiddleware }