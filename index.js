require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const fs = require("fs");
const url = require("url");
const PORT = process.env.PORT || 8080;
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const jsonFilePath = path.resolve(__dirname, process.env.JSON_FILE_PATH);

// GET Menu
app.get("/api/menu", (req, res) => {
  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      console.log("Error reading JSON file:", err);
      res.status(500).send("Error reading menu data");
      return;
    }
    try {
      const menuData = JSON.parse(data);
      res.json(menuData);
    } catch (parseErr) {
      console.error("Error parsing JSON data:", parseErr);
      res.status(500).send("Error parsing menu data");
    }
  });
});

const ordersFilePath = path.resolve(__dirname, process.env.ORDERS_FILE_PATH);

// Helper function to generate unique order ID
function generateOrderId() {
  return Math.floor(Date.now() + Math.random()).toString(36);
}

// POST request to create a new order
app.post("/api/order", (req, res) => {
  const newOrder = req.body;

  // Validate request body to ensure it has all required fields
  if (
    !newOrder.customer ||
    !newOrder.phone ||
    !newOrder.address ||
    !Array.isArray(newOrder.cart) ||
    newOrder.cart.length === 0 ||
    !newOrder.position
  ) {
    return res.status(400).send("Invalid order data");
  }

  // Generate a unique ID for the new order
  newOrder.orderId = generateOrderId();

  // Read existing orders from the file
  fs.readFile(ordersFilePath, (err, data) => {
    if (err) {
      console.error("Error reading orders file:", err);
      return res.status(500).send("Error reading orders data");
    }

    let orders = [];
    try {
      orders = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing orders data:", parseErr);
      return res.status(500).send("Error parsing orders data");
    }

    // Add the new order to the orders array
    orders.push(newOrder);

    // Write the updated orders array back to the file
    fs.writeFile(
      ordersFilePath,
      JSON.stringify(orders, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing to orders file:", writeErr);
          return res.status(500).send("Error saving new order");
        }

        // Send success response with new order details so the frontend can navigate to it
        res.status(201).json({ status: "success", orderId: newOrder.orderId });
      }
    );
  });
});

/////////////////////

app.get("/order/:orderId", (req, res) => {
  const { id } = req.params;

  // Read the orders file
  fs.readFile(ordersFilePath, (err, data) => {
    if (err) {
      console.error("Error reading orders file:", err);
      return res.status(500).send("Error reading orders data");
    }

    let orders;
    try {
      orders = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing orders data:", parseErr);
      return res.status(500).send("Error parsing orders data");
    }

    // Find the order by id
    const order = orders.find((order) => order.id === id);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    // Send the order data as JSON to be rendered by the frontend
    res.json(order);
  });
});

app.listen(PORT, () => {
  console.log(`Listening to requests on port ${PORT}`);
});
