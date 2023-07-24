const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


/* ----------------------------------------- MongoDB code ------------------------ */


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bjkyc58.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    }
});

async function run() {
    try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Collections
    const database = client.db('collegeDb');
    const collegeCollection = database.collection('college');
    const reviewCollection = client.db('collegeDb').collection('reviews');
    const userCollection = client.db('collegeDb').collection('users');

    // get method
    app.get('/college', async(req, res) => {
        const result = await collegeCollection.find().toArray();
        res.send(result);
    });

    // for loading specific data
    app.get('/college/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await collegeCollection.findOne(query);
        res.send(result)
    })

    // Review Collection
    app.get('/reviews', async(req, res) => {
        const result = await reviewCollection.find().toArray();
        res.send(result);
    })

    // user collections
    app.get('/users', async(req, res) => {
        const result = await userCollection.find().toArray();
        res.send(result);
    })
    app.post('/users', async(req, res) => {
        const newUser = req.body;
        const result = await userCollection.insertOne(newUser);
        res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    }
}
run().catch(console.dir);



/* ----------------------------------------- MongoDB code ------------------------ */

app.get('/', (req, res) => {
    res.send('college booking server running');
});

app.listen(port, () => {
    console.log(`college booking server on port : ${port}`);
})

