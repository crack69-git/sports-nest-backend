const express = require("express");
const cors = require("cors");

const app = express();
const dotenv = require("dotenv");
app.use(cors());
app.use(express.json());
dotenv.config();
// require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("sportzDB");
    const usersCollection = database.collection("users");
    const productsCollection = database.collection("products");
    const myBookingsCollection = database.collection("myBookings");

    app.delete("/mybookings/:id", async (req, res) => {
      const id = req.params.id;
      const result = await myBookingsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.post("/mybookings", async (req, res) => {
      const booking = req.body;
      const result = await myBookingsCollection.insertOne(booking);
      res.send(result);
    });
    app.get("/mybookings/:id", async (req, res) => {
      const id = req.params.id;
      const result = await myBookingsCollection
        .find({ email_id: id })
        .toArray();
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productsCollection.findOne({
        _id: new ObjectId(id),
      });
      // json.stringify(result);
      res.send(result);
    });

    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });
    app.get("/product", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
