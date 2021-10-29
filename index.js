const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// mongodb
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// mongodb URI and Client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vxr0x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db('aceHolidaysTourism');
        const servicesCollection = database.collection('services');


        // GET API (load all services)
        app.get('/services', async (req, res) => {
            const query = servicesCollection.find({});
            const services = await query.toArray();
            res.send(services);
        })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running!')
});

app.listen(port, () => {
    console.log('Listening port', port);
})