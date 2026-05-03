const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const dbPath = path.resolve(__dirname, "SalesAndInventory.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
  } else {
    console.log("Connected to SQLite Database");
  }
});

// Start of PRODUCTS API

app.get("/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/products", (req, res) => {
  
  const product = req.body;

  const sql = `
    INSERT INTO products (id, serial, brand, name, category, unit, unitCost, discount, retailPrice, wholesalePrice, qty)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `;

  db.run(sql, [
    product.id,
    product.serial,
    product.brand,
    product.name,
    product.category,
    product.unit,
    product.unitCost,
    product.discount,
    product.retailPrice,
    product.wholesalePrice,
    product.qty
  ], function(err){
    if (err) {
      return res.send(err);
    }
    res.send({ message: "Product added successfully" });
  })
});

app.put("/products/:id", (req, res) => {

  const product = req.body;

  const sql = `
    UPDATE products
    SET serial = ?, brand = ?, name = ?, category = ?, unit = ?, unitCost = ?, discount = ?, retailPrice = ?, wholesalePrice = ?, qty = ?
    WHERE id = ?
  `;

  db.run(sql, [
    product.serial,
    product.brand,
    product.name,
    product.category,
    product.unit,
    product.unitCost,
    product.discount,
    product.retailPrice,
    product.wholesalePrice,
    product.qty,
    product.id
  ], function(err){
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Product updated successfully" });
  });

});

app.delete("/products/:id", (req, res) => {
  const id = req.params.id;

  const sql = `DELETE FROM products WHERE id = ?`;

  db.run(sql, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Product deleted successfully" });
  });
});

// Start of USERS API

app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/users", (req, res) => {
  
  const user = req.body;

  const sql = `
    INSERT INTO users (id, name, username, password, type, email, address, number)
    VALUES (?,?,?,?,?,?,?,?)
  `;

  db.run(sql, [
    user.id,
    user.name,
    user.username,
    user.password,
    user.type,
    user.email,
    user.address,
    user.number
  ], function(err){
    if (err) {
      return res.send(err);
    }
    res.send({ message: "User added successfully" });
  })
});

app.put("/users/:id", (req, res) => {

  const id = req.params.id; 
  const user = req.body;

  const sql = `
    UPDATE users
    SET name = ?, username = ?, password = ?, type = ?, email = ?, address = ?, number = ?
    WHERE id = ?
  `;

  db.run(sql, [
    user.name,
    user.username,
    user.password,
    user.type,
    user.email,
    user.address,
    user.number,
    id
  ], function(err){
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "User updated successfully" });
  });

});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  const sql = `DELETE FROM users WHERE id = ?`;

  db.run(sql, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "User deleted successfully" });
  });
});

// End of USERS API


// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});