const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6oh3q2n.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const brandCollection = client.db('brandDB').collection('brand');
    const productCollection = client.db('productDB').collection('product');
    const brandProductCollection = client.db('brandProductDB').collection('brandProduct')
    const cartCollection = client.db('cartDB').collection('cart')

    app.get('/brand', async(req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/brandProduct/:brandName', async(req, res) =>{
      const brandName = req.params.brandName;
      console.log('brandName', brandName);
      const query = {brand_name: brandName};
      const cursor = brandProductCollection.find(query);
      const result =  await cursor.toArray();
      res.send(result);
    })

    app.post('/brandProduct', async(req,res) =>{
      const productItem = req.body;
      console.log(productItem);
      const result = await brandProductCollection.insertOne(productItem);
      res.send(result);
    })

    // 
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id),};
      const result = await brandProductCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.post('/brand', async(req, res) => {
      const brandItem = req.body;
      console.log(brandItem);
      const result = await brandCollection.insertOne(brandItem);
      res.send(result);
    })

    app.post('/cart', async(req, res) =>{
      const addCart = req.body;
      console.log(addCart);
      const result = await cartCollection.insertOne(addCart)
      console.log(result);
      res.send(result);
    })

    app.get('/cart/', async(req, res) =>{
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
      
    })

    app.get('/brandProduct/:id', async(req, res) =>{
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)};
      const result = await brandProductCollection.findOne(query);
      console.log(result);
      res.send(result);
    })

    app.put('/brandProduct/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedProduct = req.body;
      
      const product = {
        $set: {
          name: updatedProduct.name, 
          brand_name: updatedProduct.brand_name, 
          type: updatedProduct.type, 
          price: updatedProduct.price, 
          rating: updatedProduct.rating, 
          photo: updatedProduct.photo
        }
      }

      const result = await brandProductCollection.updateOne(filter, product, options)
      res.send(result); 
    })

    app.delete('/cart/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Brand shop server is running')
})

app.listen(port, () => {
    console.log('Brand shop server is running')
})