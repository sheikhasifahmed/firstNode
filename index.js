const { MongoClient } = require("mongodb");

require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("hello from node");
});

app.listen(port, () => {
  console.log("listening to port");
});

// user: firstUser
// password:nzLCtSe0Aj0NABLI

const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env._DB_USER}:${process.env._DB_PASS}@cluster0.ig2yp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("master");
    const personsCollection = database.collection("persons");
    // create a document to insert

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await personsCollection.insertOne(newUser);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(newUser);
    });
    app.get("/users", async (req, res) => {
      const cursor = personsCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: { name: updatedUser.name, email: updatedUser.email },
      };
      const result = await personsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await personsCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
