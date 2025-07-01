const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const app = express();

// middleware
app.use(cors())
app.use(express.json());

// mongodb server

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uuac6m8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const campCollections = client.db('crowdcubeDB').collection('campaign');
        const donateCollections = client.db('crowdcubeDB').collection('donation');
        // post a data
        app.post('/addCampaign', async (req, res) => {
            const camData = req.body;
            const result = await campCollections.insertOne(camData);
            res.send(result);
            console.log(result);
        })

        // get all data 
        app.get('/all-campaign', async (req, res) => {
            const result = await campCollections.find().toArray();
            res.send(result);
        })
        app.get('/campaigns/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await campCollections.findOne(query);
            res.send(result);
        })
        // user email data
        app.get('/all-campaign/:email', async(req, res) => {
            const email = req.params.email;
            const query = {'userData.email': email};
            const result = await campCollections.find(query).toArray();
            res.send(result);
        })
        // delete campaign data 
        app.delete('/campaign/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await campCollections.deleteOne(query);
            res.send(result);
        })
        // specifice user data
        app.get('/myCampaign/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await campCollections.findOne(query);
            res.send(result);
        })
        // update user data
        app.put('/addCampaign/:id', async(req, res) => {
            const id = req.params.id;
            const userData = req.body;
            const updatedDoc = {
                $set: userData,
            }
            const filter = {_id: new ObjectId(id)};
            const option = {upsert: true};
            const result = await campCollections.updateOne(filter, updatedDoc, option);
            res.send(result);
        })
        // donation ammount
        app.post('/donation', async(req, res) => {
            const body = req.body;
            const result = await donateCollections.insertOne(body);
            res.send(result);
        })
        // specifice my donation by email
        app.get('/myDonation/:email', async(req, res) => {
            const email = req.params.email;
            const query = {'userData.email': email};
            const result = await campCollections.find(query).toArray();
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send('server is running')
})
app.listen(port, () => {
    console.log(`app running on port ${port}`);
})