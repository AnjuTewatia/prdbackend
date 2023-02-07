const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: String,
        image1: String,
        image2: String,
        image3: String,
        image4: String,
        price: Number,
        soldby: String,
        quantity: Number,
        category: String,
        code: String
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = Product = mongoose.model("product", productSchema);