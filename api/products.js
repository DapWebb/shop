// api/products.js
const { MongoClient } = require('mongodb');

// URI MongoDB Atlas Anda
const uri = "mongodb+srv://bzeyo016_db_user:Cx1wNGtWePfG3OFR@komentar.q1wdlbn.mongodb.net/?retryWrites=true&w=majority&appName=komentar";
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

module.exports = async (req, res) => {
  // Pengaturan CORS agar bisa diakses oleh frontend Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('komentar_db');
    
    // Ambil produk yang diinput dari Bot Telegram (diurutkan dari yang terbaru)
    const products = await db.collection('shop_products')
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    return res.status(200).json({ status: 'success', products });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
