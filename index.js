require("dotenv").config();
const express = require("express");
const connect = require("./src/config/db");
const cartrouter = require("./src/features/Cart/cart.route");
const userrouter = require("./src/features/Auth/user.route");
const productrouter = require("./src/features/Product/product.route");
const PORT = process.env.PORT || 8080;
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/user", userrouter);
// product router
app.use("/product", productrouter);

app.use("/cart", cartrouter);

app.get("", async (req, res) => {
  try {
    res.sendFile(__dirname + "/src/utils/index.html");
  } catch (error) {
    res.send(error.message);
    console.log(error);
  }
});
app.listen(PORT, async (req, res) => {
  try {
    await connect();
    console.log("Connected to mongodb");
  } catch (error) {
    console.log(error);
  }
  console.log(`http://localhost:${PORT}`);
});
