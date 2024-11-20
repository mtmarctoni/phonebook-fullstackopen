require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/Person')
const mongoose = require('mongoose')

// connect to mongoose
const MONGO_DB_URI = process.env.MONGO_DB_URI
console.log(MONGO_DB_URI)

mongoose.set('strictQuery',false)

console.log('Connecting to MongoDB...')
mongoose.connect(MONGO_DB_URI)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(err => {
        console.log('Error connecting to MongoDB:', err)
    })

const PORT = process.env.PORT || 3001
morgan.token('body', req =>
    JSON.stringify(req.body) === '{}'
        ? ''
        : JSON.stringify(req.body)
)
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
    console.error(err.message)
    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (err.name === 'ValidationError') {
        return res.status(400).send({ error: err.message })
    } else if (err.name === 'MongoError') {
        return res.status(400).send({ error: 'Database error' })
    } else if (err.name === 'TypeError') {
        return res.status(400).send({ error: `TypeError: ${err.message}` })
    }




    next(err)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', async (req, res) => {
    const count = await Person.countDocuments({})

    res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
        `)
})

app.get('/api/persons', async (req, res) => {
    const persons = await Person.find({})
    res.json(persons)
})

app.get('/api/persons/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const person = await Person.findById(id)
        person
            ? res.json(person)
            : res.status(404).send({ error: 'not found' })

    } catch (err) {next(err)}
})

app.delete('/api/persons/:id', async (req, res, next) => {
    const { id } = req.params
    try {
        const person = await Person.findByIdAndDelete(id)
        if (person) {
            res.status(204).end()
        } else {
            res.status(404).end()
        }
    } catch (err) {next(err)}
})

app.post('/api/persons', async (req, res, next) => {
    const { name, number } = req.body

    if (!name || !number) {
        return res.status(400).json({ error: 'content missing' })
    }

    const newPerson = new Person ({
        name: name,
        number: number
    })

    try {
        const newPersonSaved = await newPerson.save()
        res.json(newPersonSaved)
    } catch (err) {next(err)}

})

app.put('/api/persons/:id', async (req, res, next) => {
    const { name, number } = req.body
    //const { id } = req.params

    if (!name || !number) {
        return res.status(400).json({ error: 'content missing' })
    }

    try {
        const personToUpdate = await Person.find({ name: name })
        if (personToUpdate.length > 0) {
            const updatedPerson = await Person.findByIdAndUpdate(personToUpdate[0].id,
                { number: number },
                { new: true, runValidators: true, context: 'query' })
            res.json(updatedPerson)
        } else {
            res.status(404).end()
        }
    } catch (err) { next(err) }

})

app.listen(PORT, () => {
    console.log('Listening on port', PORT)

})

app.use(unknownEndpoint)
app.use(errorHandler)
