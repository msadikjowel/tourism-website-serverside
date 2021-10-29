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
        const bookingsCollection = database.collection('bookings')


        // GET API (load all services)
        app.get('/services', async (req, res) => {
            const query = servicesCollection.find({});
            const services = await query.toArray();
            res.send(services);
        });


        // GET API (load single service)
        app.get('/singleService/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            res.send(result);
        });


        // GET API (load my booking)
        app.get('/myBooking/:email', async (req, res) => {
            const email = req.params.email;
            const result = await bookingsCollection.find({ email }).toArray();
            res.send(result);
        });


        // POST API (confirm booking)
        app.post('/confirmBooking', async (req, res) => {
            const query = req.body;
            const result = await bookingsCollection.insertOne(query);
            res.send(result);
        });


        // DELETE API (delete from confirmed booking)
        app.delete('/confirmBooking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.send(result);
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