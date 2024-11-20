require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const mongoose = require('mongoose')

// connect to mongoose
const MONGO_DB_URI = process.env.MONGO_DB_URI
console.log(MONGO_DB_URI);

mongoose.set('strictQuery',false)

console.log('Connecting to MongoDB...');
mongoose.connect(MONGO_DB_URI)
    .then(res => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.log('Error connecting to MongoDB:', err);
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
    }
    next(err)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/*
//Get all persons
personsRouter.get("/api/persons", async (req, res) => {
    const persons = await Person.find({})
        .populate('user', {userName: 1, name: 1 })
    
      if (persons) {
          res.json(persons)
        } else {
          res.satus(404).end()
        }
  
  })
*/
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
    console.log('EN DELETE', id);
    console.log('tipo id', typeof(id));
    
    
    try {
        const person = await Person.findByIdAndDelete(id)
        if (person) {
            res.status(204).end()
        } else {
            res.status(404).end()
        }
    } catch (err) {next(err)}
        
})

app.post('/api/persons', async (req, res) => {
    const { name, number } = req.body
    
    if (!name || !number) {
        return res.status(400).json({ error: 'content missing' })
    }
    
    //if (contacts.find(c => c.name === name)) {
    //    return res.status(400).json({ error: 'name must be unique' })
    //}
    
    const newPerson = new Person ({
        //id: generateId(),
        name: name,
        number: number
    })

    const newPersonSaved = await newPerson.save()    
    res.json(newPersonSaved)
    
})

app.put('/api/persons/:id', async (req, res, next) => {
    const { name, number } = req.body
    const { id } = req.params
    
    if (!name || !number) {
        return res.status(400).json({ error: 'content missing' })
    }
    try {
        const personToUpdate = await Person.find({ name: name })
        if (personToUpdate.length > 0) {
            const updatedPerson = await Person.findByIdAndUpdate(personToUpdate[0].id, { number: number })
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
