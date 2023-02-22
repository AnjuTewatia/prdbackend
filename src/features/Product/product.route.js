const express = require("express");
const Product = require("./product.model");

const app = express.Router();

// Get request for all products  pagination , limit , get by category ,
//  get by category and sort by price , search by title in category
//  and by default get all products
app.get("/allprodAdmin", async (req, res) => {
  try {
    let product = await Product.find();
    res.status(200).send(product);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

app.get("", async (req, res) => {
  const { page = 1, limit = 20, category, input, priceSort } = req.query;
  try {
    if (priceSort && category) {
      if (priceSort === "asc") {
        let product = await Product.find({ category })
          .sort({ price: 1 })
          .skip((page - 1) * limit)
          .limit(limit);
        return res.status(200).send(product);
      } else if (priceSort === "desc") {
        let product = await Product.find({ category })
          .sort({ price: -1 })
          .skip((page - 1) * limit)
          .limit(limit);
        return res.status(200).send(product);
      }
    } else if (input && category) {
      let temp = new RegExp(input, "i");
      let product = await Product.find({ title: temp }).limit(limit);
      return res.status(200).send(product);
    } else if (category) {
      let product = await Product.find({ category })
        .skip((page - 1) * limit)
        .limit(limit);
      return res.status(200).send(product);
    } else if (input) {
      let temp = new RegExp(input, "i");
      let product = await Product.find({ title: temp }).limit(limit);
      return res.status(200).send(product);
    } else {
      let product = await Product.find()
        .skip((page - 1) * limit)
        .limit(limit);
      return res.status(200).send(product);
    }
  } catch (error) {
    return res.send(error.message);
  }
});

// get single product by Id
app.get("/:id", async (req, res) => {
  try {
    let product = await Product.findById({ _id: req.params.id });
    return res.status(200).send(product);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

// post method for add products
app.post("", async (req, res) => {
  const payload = req.body;
  try {
    const product = new Product(payload);
    await product.save();
    return res.status(201).send({ message: "product added successfully" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

// delete method to delete products
app.delete("/:id", async (req, res) => {
  try {
    let product = await Product.findByIdAndDelete({ _id: req.params.id });
    return res.status(200).send({ message: "product Deleted successfully " });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

// patch method to update products
app.patch("/:id", async (req, res) => {
  const payload = req.body;
  try {
    await Product.findByIdAndUpdate({ _id: req.params.id }, payload);
    return res.status(200).send({ message: "product updated successfully  " });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = app;
