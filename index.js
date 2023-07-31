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
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// genarate random number from 0-18
const genarateRendomNumber = () => Math.floor(Math.random(1) * 18);

const run = async () => {
  const productCollection = client.db("pc-builder").collection("products");

  app.get("/products", async (req, res) => {
    const cursor = productCollection.find({});
    const products = await cursor.toArray();

    const randomIndex = new Set();
    while (randomIndex.size < 8) {
      const newIndex = genarateRendomNumber();
      randomIndex.add(newIndex);
    }
    const resultArray = Array.from(randomIndex);
    const randomProductsArr = resultArray.map(
      (randomIndex) => products[randomIndex]
    );

    res.send({ status: true, data: randomProductsArr });
  });

  app.get("/product/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const result = await productCollection.findOne({ _id: new ObjectId(id) });
    res.send(result);
  });

  app.get("/category/:category", async (req, res) => {
    const categoryName = req.params.category;
    const result = await productCollection
      .find({
        category: categoryName,
      })
      .toArray();
    res.send(result);
  });
};
// check
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
