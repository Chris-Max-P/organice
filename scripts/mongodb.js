const { MongoClient, ServerApiVersion } = require("mongodb");

// Replace the placeholder with your Atlas connection string
const uri = "mongodb://127.0.0.1:27017/organice";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri,  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  }
);

const myDB = client.db("organice");

let db;

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    db = await client.connect()
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch(e) {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

function close() {
  client.close();
}

run().catch(console.dir);


// ------- CRUD operations -------

async function insert(event) {
  const myColl = myDB.collection("events");

  const result = await myColl.insertOne(event);
  console.log(
    `A document was inserted with the _id: ${result.insertedId}`,
  );
}

async function findAll() {
  const myColl = myDB.collection("events");
  return await myColl.find({}).toArray();
}

module.exports = {
  findAll,
  save: insert,
  openDbConnection: run,
  closeDbConnection: close,
};
