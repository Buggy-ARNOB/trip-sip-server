const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors());
//To do json of client response
app.use(express.json());

//dbuser2
//HT9WyjLhMdX0j5us


const uri = "mongodb+srv://dbUser2:HT9WyjLhMdX0j5us@initial-cluster.sxizreu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        const serviceCollection = client.db("tripSip").collection("service")

        const upcommingServices = client.db("tripSip").collection("upcomming")

        ////Read/To Show all data from database 
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/upcomming', async (req, res) => {
            const query = {};
            const cursor = upcommingServices.find(query);
            const up = await cursor.toArray();
            res.send(up);
        })


        //Create Service
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service)

            const result = await serviceCollection.insertOne(service)
            res.send(result);
        })



        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            console.log('Trying to delete', id);
            const result = await serviceCollection.deleteOne(query)
            console.log(result);
            res.send(result);
        })


        //Filtering desired data for Update Operation
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query)
            res.send(service);
        })

        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true }
            const service = req.body;
            console.log(service);
            const updatedUser = {
                $set: {
                    title: service.title,
                    imageLink: service.imageLink,
                    price: service.price
                }
            }

            const result = await serviceCollection.updateOne(filter, updatedUser, option);
            res.send(result)
        })

    }

    finally {

    }
}




run().catch(err => console.log(err))




app.get('/', (req, res) => {
    res.send('API Running');
});

app.listen(port, () => {
    console.log('Server running on port', port);
})