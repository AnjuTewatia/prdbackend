const express = require("express");
const Product = require("../Product/product.model");
const Cart = require("./cart.model");
const { authMiddleware } = require("./auth.middleware");

const app = express.Router();


// function to check Cart item quantity and database product quantity
const Check = (productquantity, incomingquantity) => {
    if (productquantity < incomingquantity) {
        return true
    } else {
        return false
    }
}
// middleware for user verification
app.use(authMiddleware);


// route for getting Cart Data
app.get("", async (req, res) => {
    try {
        const cart = await Cart.find({ user: req._id }).populate(["user", "product"]);
        return res.send(cart);
    } catch (error) {
        return res.send(error.message);
    }
})

// route for addtocart  
app.post("/:id", async (req, res) => {
    const { quantity, type } = req.body;
    const productID = req.params.id;
    try {
        const product = await Product.findById({ _id: productID });
        const cartItem = await Cart.findOne({ user: req._id, product: productID })
        if (!cartItem) {
            if (Check(product.quantity, quantity)) {
                return res.send({ message: `Database has only ${product.quantity} quantity left` })
            } else {
                const cart = await Cart.create({
                    product: productID,
                    user: req._id,
                    quantity: quantity,
                });
                await Product.findByIdAndUpdate(
                    {
                        _id: productID
                    },
                    {
                        $inc: { quantity: -1 }
                    }
                );
                return res.sendStatus(cart)
            }
        } else {
            if (!type) {
                return res.send("type is missing");
            } else if (type === "incr") {
                if (Check(product.quantity, quantity)) {
                    return res.send({ message: `Database has only ${product.quantity} quantity left` })
                } else {
                    await Cart.findOneAndUpdate(
                        {
                            product: productID,
                        },
                        {
                            $inc: { quantity: 1 },
                        }
                    );
                    await Product.findByIdAndUpdate(
                        {
                            _id: productID
                        },
                        {
                            $inc: { quantity: -1 }
                        }
                    );
                    return res.send("Updated")
                }
            } else if (type == "decr") {
                if (cartItem.quantity == 1) {
                    await Product.findByIdAndUpdate(
                        {
                            _id: productID
                        },
                        {
                            $inc: { quantity: cartItem.quantity }
                        });
                    await Cart.findOneAndDelete({ _id: cartItem._id });
                    return res.send("Deleted successfully")
                } else {
                    let cart = await Cart.findOneAndUpdate(
                        {
                            product: productID,
                        },
                        {
                            $inc: { quantity: -1 },
                        }
                    );
                    await Product.findByIdAndUpdate(
                        {
                            _id: productID
                        },
                        {
                            $inc: { quantity: 1 }
                        }
                    );
                    return res.send(cart);
                }
            }
        }
    } catch (error) {
        return res.send(error.message)
    }
})

// route for deleting cart items
app.delete("/:id", async (req, res) => {
    try {
        const cart = await Cart.findById({ _id: req.params.id });
        const product = await Product.findByIdAndUpdate(
            {
                _id: cart.product
            },
            {
                $inc: { quantity: cart.quantity },
            }
        );
        await Cart.findByIdAndDelete({ _id: cart._id });
        return res.send(product)
    } catch (error) {
        return res.send(error.message)
    }
});



module.exports = app;