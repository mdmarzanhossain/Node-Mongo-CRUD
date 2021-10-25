const express = require('express');  //1. node js e kaj er jnno suru tei express  require korte hobe
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient; //DB1. mongodb er sathe connect er jnno
const password = 'MUih.39fTL3c_LP';
const ObjectId = require('mongodb').ObjectId; //database e data identify er jonno object id niye aschi

const uri = `mongodb+srv://organicUser:${password}@cluster0.o25ox.mongodb.net/organicdb?retryWrites=true&w=majority`; //DB2. mongodb er id pass url
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });  //DB3. mongodb er connection er jnno

const app = express(); //2. express create korar por express diye application create korte hobe

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //form e submit er jnno use hoi

app.get('/',(req,res)=>{      // root / localhost e node js run er jnno path bole dite hobe then 1 ti response o 1 ti request pawa jabe.
    res.sendFile(__dirname + '/index.html');  //backend e ai file ta local host e load kortese
})

client.connect(err => { //DB4. mongodb te db er sathe connect er jnno
    const productCollection = client.db("organicdb").collection("products");  //kon database er sathe connect korbe se jnno

    //database er data load / read
    app.get('/products',(req, res) => {  //database theke sob read kore show korbe
        productCollection.find({}).limit(10) // limit koita / koita data load korbo bole deya jai
            .toArray((err, documents) =>{
                res.send(documents);
            })
    })

    app.get('/product/:id', (req,res) =>{
        productCollection.find({_id: ObjectId(req.params.id)})
            .toArray((err, documents) =>{
                res.send(documents[0]);
            })
    })

    //product add er code
    app.post("/addProduct",(req,res) =>{
        const product = req.body;
        productCollection.insertOne(product)  //insertOne diye database e product add kore
            .then(result => {
                console.log("data added successfully");
                res.redirect('/');
            })
    });

    //kon data k update korbo tar code
    app.patch('/update/:id',(req, res) => {
        console.log(req.body.price);
        productCollection.updateOne({_id: ObjectId(req.params.id)},
            {
                $set: {price: req.body.price, quantity: req.body.quantity}
            }
        )
            .then(result =>{
                res.send(result.modifiedCount > 0);
            })
    })

    //product delete
    app.delete('/delete/:id',(req,res)=>{
       productCollection.deleteOne({_id: ObjectId(req.params.id)})
           .then( result=>{
               res.send(result.deletedCount > 0);
           })
    })
});


app.listen(3000); //3. app create er por app er liten port deya lagbe j url port diye node js kaj korbe