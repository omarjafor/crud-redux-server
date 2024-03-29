const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.21hcnfr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run(){
    try{
        const userCollection = client.db('assetDB').collection('users');

        app.get('/users', async(req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })

        app.post('/post', async(req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.put('/update/:id', async(req, res) => {
            const id = req.params.id;
            const update = req.body;
            const filter = {_id: new ObjectId(id)}
            const admin = {
                $set: {
                    name: update.name,
                    email: update.email
                }
            }
            const result = await userCollection.updateOne(filter, admin);
            res.send(result);
        })

        app.delete('/delete/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id)}
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Redux Server is Running')
})

app.listen(port, () => {
    console.log('Redux is Running on port', port);
})