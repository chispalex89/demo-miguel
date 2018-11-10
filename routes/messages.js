const createError = require('http-errors')
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const mongoClient = require('mongodb').MongoClient
const url = `mongodb://localhost:27017`
const dbName = 'demo'

let messages = [
    {
        "_id": 123,
        sender: {
            name: 'Miguel',
            "_id": 1,
            username: 'miguelspc'
        },
        receiver: {
            name: 'Pablo',
            "_id": 2,
            username: 'chispalex89'
        },
        text: 'hola',
        date: '2018-11-09 17:25'
    },
    {
        "_id": 124,
        receiver: {
            name: 'Miguel',
            "_id": 1,
            username: 'miguelspc'
        },
        sender: {
            name: 'Pablo',
            "_id": 2,
            username: 'chispalex89'
        },
        text: 'holi',
        date: '2018-11-09 17:26'
    }
]

/* GET home page. */
router.get('/', function (req, res, next) {
        mongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
            if(err) return next(createError(500))
            const database = client.db(dbName)
            const collection = database.collection('messages')
            collection.find({}).toArray((err, docs) => {
                if(err) return next(createError(500))
                res.status(200).json(docs)
            })
        })
        //find = select
        //find    {message:'hola'}
        //select where message = 'hola'
})

router.post('/', (req, res, next) => {
    const { username, name } = req.body.sender
    /*jwt.sign({ username, name }, 'secret', {
        expiresIn: 60
    }, (err, encoded) => {
        if (err) return next(createError(500))
        messages.push(req.body)
        res.status(201).json({ token: encoded })
    })*/

    mongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        if(err) return next(createError(500))
        const database = client.db(dbName)
        const collection = database.collection('messages')
        collection.insertOne(req.body, err => {
            if(err) return next(createError(500))
            res.status(201).end()
        })
    })
})

//localhost:3000/messages/2
router.put('/:id', (req, res, next) => {
    if (!messages[req.params.id]) return next(createError(404))
    messages[req.params.id] = req.body
    res.status(204).end()
})

router.delete('/:id', (req, res, next) => {
    messages.splice(req.params.id, 1)
    res.status(204).end()
})

module.exports = router;
