const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello PC Builder!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mj4ed9j.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  const productCollection = client.db("pc-builder").collection("products");

  app.get("/products", async (req, res) => {
    const cursor = productCollection.find({});
    const product = await cursor.toArray();

    res.send({ status: true, data: product });
  });

  app.get("/product/:id", async (req, res) => {
    const id = req.params.id;
    const result = await productCollection.findOne({ _id: id });
    res.send(result);
  });
};
// check
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
