console.log('Veikia');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const mysqlConfig = {
  host: '194.135.87.110',
  user: 'slscom_demo',
  password: 'SKtdb4QPSGsrZWNU',
  database: 'slscom_demo',
};

app.get('/test', async (req, res) => {
  try {
    const connection = await mysql.createConnection(mysqlConfig);
    res.json('Server is online');
    console.log(`Success: ${connection}`);
    await connection.end();
  } catch (e) {
    console.log(e);
  }
});

app.post('/products', async (req, res) => {
  try {
    const connection = await mysql.createConnection(mysqlConfig);
    console.log('Connected to DB===');

    const sql = `
    INSERT INTO products (id, image_url, title, description, price) VALUES 
(?, ?, ?, ?, ?)`;

    const idEl = req.body.id;
    const imageEl = req.body.image_url;
    const titleEl = req.body.title;
    const descEl = req.body.description;
    const priceEl = req.body.price;

    const [rows, fields] = await connection.execute(sql, [
      idEl,
      imageEl,
      titleEl,
      descEl,
      priceEl,
    ]);

    await connection.close();
    res.json({ rows, fields });
  } catch (error) {
    console.log('klaida prisijungiant', error);
    res.status(500).send('klaida kazkur del kazko');
  }
});

app.get('/products', async (req, res) => {
  try {
    const connection = await mysql.createConnection(mysqlConfig);
    console.log('Connected to DB===');
    const sql = 'SELECT * FROM products';
    const [rows] = await connection.execute(sql);
    await connection.close();
    res.json(rows);
  } catch (error) {
    console.log('klaida prisijungiant', error);
    res.status(500).send('klaida kazkur del kazko');
  }
});

app.get('/totalproducts', async (req, res) => {
  try {
    const connection = await mysql.createConnection(mysqlConfig);
    console.log('Connected to DB===');
    const sql = 'SELECT COUNT(id) AS TotalProducts FROM products';
    const [rows] = await connection.execute(sql);
    await connection.close();
    res.json(rows);
  } catch (error) {
    console.log('klaida prisijungiant', error);
    res.status(500).send('klaida kazkur del kazko');
  }
});

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
