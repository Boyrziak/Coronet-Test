const
    express = require('express'),
    httpApp = require('express')(),
    bodyParser = require('body-parser'),
    request = require('request'),
    path = require('path'),
    multer = require('multer'),
    MongoClient = require('mongodb').MongoClient,
    app = express(bodyParser.json()),
    http = require('http').createServer(httpApp),
    io = require('socket.io')(http),
    mongoClient = new MongoClient("mongodb://127.0.0.1:27017/", {useNewUrlParser: true}),
    router = express.Router();
port = 1603;

app.use('/', router);
app.listen(port, (err, req, res) => {
    if (err) return console.log(`Something bad has happen : ${err}`);
    console.log(`Server listening at port ${port}`);
});
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
});

http.listen(3000, ()=>{
   console.log('Listening on 3000');
});

io.on('connection', function(socket){
    socket.on('update', function () {
        const collection = app.locals.collection;
        collection.find({}).toArray((err, users) => {
            if (err) {
                return console.log(err);
            }
            io.emit('update', users);
        });
    });
});

mongoClient.connect((err, client) => {
    if (err) {
        return console.log(err);
    }
    app.locals.collection = client.db("coronet_users").collection('users');
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/index.html'));
});

router.get('/getUsers', (req, res) => {
    const collection = req.app.locals.collection;
    collection.find({}).toArray((err, users) => {
        if (err) {
            return console.log(err);
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.status(200).json(users);
    });
});


router.get('/getUser', (req, res) => {
    const collection = req.app.locals.collection;
    collection.findOne({id: parseInt(req.query.userId)}, (err, result) => {
        if (err) {
            return console.log(err);
        }
        console.log(result);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.status(200).json(result);
    });
});

router.get('/updateUser', (req, res) => {
    const collection = req.app.locals.collection;
    req.query.id = parseInt(req.query.id);
    collection.updateOne({id: parseInt(req.query.id)}, {$set: req.query}, (err, result) => {
        if (err) {
            console.log('Error');
            return console.log(err);
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.status(200).json(result);
        collection.find({}).toArray((err, users) => {
            if (err) {
                return console.log(err);
            }
            io.emit('update', users);
        });
    });
});

router.get('/deleteUser', (req, res) => {
    const collection = req.app.locals.collection;
    collection.deleteOne({id: parseInt(req.query.id)}, (err, result) => {
        if (err) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.status(501).json({error: err});
            return console.log(err);
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.status(200).json(result);
        collection.find({}).toArray((err, users) => {
            if (err) {
                return console.log(err);
            }
            io.emit('update', users);
        });
    });
});

router.get('/addUser', (req, res) => {
    const collection = req.app.locals.collection;
    console.log(req.query);
    collection.find({}).toArray((err, users) => {
        if (err) {
            return console.log(err);
        }
        let number = users.length;
        req.query.id = number + 1;
        collection.insertOne(req.query, (err, result) => {
            if (err) {
                return console.log(err);
            }
            console.log(result);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.status(200).json(result);
            collection.find({}).toArray((err, users) => {
                if (err) {
                    return console.log(err);
                }
                io.emit('update', users);
            });
        });
    });
});