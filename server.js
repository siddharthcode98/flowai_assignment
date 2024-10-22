const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const server = express();
server.use(express.json());

let db = null;

let dbPath = path.join(__dirname, "transactions.db");

const initializeAndConnectDB = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    server.listen(3000, () => {
      console.log("server is listening through 3000");
    });
  } catch (error) {
    console.log(`DB error:${error}`);
    process.exit(1);
  }
};

initializeAndConnectDB();
//API new _transaction

server.post("/transactions", async (req, res) => {
  const { name, type, amount, date, description } = req.body;
  //console.log(name);
  try {
    //inserting in category table
    const insertIntoCategoryTable = `INSERT INTO categories(name,type) VALUES('${name}','${type}');`;
    const categoryId = await db.run(insertIntoCategoryTable);
    const insertIntoTrasactionTable = `INSERT INTO transactions(category,amount,type,description,date) VALUES(${categoryId.lastID},${amount},'${type}','${description}','${date}');`;
    await db.run(insertIntoTrasactionTable);
    res.status(200).json({ message: "entered successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

//API Get All Transaction

server.get("/transactions", async (req, res) => {
  try {
    const getAllTransactions = `SELECT * FROM transactions 
    INNER JOIN categories ON transactions.category==categories.id;`;
    const result = await db.all(getAllTransactions);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//API GET transaction of specific ID
server.get("/transactions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getSingleTransaction = `SELECT * FROM transactions 
    INNER JOIN categories ON 
    transactions.category==categories.id 
    WHERE transactions.id==${id};`;
    const transaction = await db.get(getSingleTransaction);

    transaction
      ? res.status(200).json(transaction)
      : res.status(404).json({ message: "not found" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//API Updates transaction of a specifi id

server.put("/transactions/:id", async (req, res) => {
  try {
    const { description } = req.body;
    const { id } = req.params;
    const updateDescription = `UPDATE 
    transactions SET description='${description}' 
    WHERE transactions.id==${id};`;
    const result = await db.run(updateDescription);
    console.log(result);
    if (result.changes !== 1) {
      res.status(404).json({ message: "not found" });
    } else {
      res.status(200).json({ message: "updated successfully" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});
//API Deleted a specific transaction

server.delete("/transactions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTransaction = `DELETE FROM transactions WHERE transactions.id==${id};`;
    const deleteCategory = `DELETE FROM categories WHERE categories.id==${id};`;
    await db.run(deleteCategory);
    const result = await db.run(deleteTransaction);
    //console.log(result);
    if (result.changes !== 1) {
      res.status(404).json({ message: "not found" });
    } else {
      res.status(200).json({ message: "Deleted successfully" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//GET SUMMARY

server.get("/summary", async (req, res) => {
  try {
    const getSummary = `SELECT 
        (SELECT SUM(amount) FROM transactions WHERE type='income') AS total_income,
        (SELECT SUM(amount) FROM transactions WHERE type='expense')AS total_expense,
        ((SELECT SUM(amount) FROM transactions WHERE type='income')-(SELECT SUM(amount) FROM transactions WHERE type='expense')) AS balance
        FROM transactions 
        LIMIT 1 `;
    const result = await db.get(getSummary);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});
