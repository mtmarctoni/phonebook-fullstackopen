const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const PORT = process.env.PORT || 3001
morgan.token('body', req =>
    JSON.stringify(req.body) === '{}'
        ? ''
        : JSON.stringify(req.body)
)

let contacts = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    return String(Math.floor(Math.random() * 1000000) + 1)
    /*
    const lastId = contacts.length === 0 ? 0 : Math.max(...contacts.map(p => Number(p.id)))
    return String(lastId +1)
    */
}

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (req, res) => {
    res.send(`
        <p>Phonebook has info for ${contacts.length} people</p>
        <p>${new Date()}</p>
        `)
})

app.get('/api/persons', (req, res) => {
    res.json(contacts)
})

app.get('/api/persons/:id', (req, res) => {
    const { id } = req.params
    const contact = contacts.find(contact => contact.id === id)
    
    contact
        ? res.json(contact)
        : res.status(404).send({ error: 'not found' })
})

app.delete('/api/persons/:id', (req, res) => {
    const { id } = req.params
    contacts = contacts.filter(contact => contact.id !== id)
        
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body
    
    if (!name || !number) {
        return res.status(400).json({ error: 'content missing' })
    }
    
    if (contacts.find(c => c.name === name)) {
        return res.status(400).json({ error: 'name must be unique' })
    }
    
    const newContact = {
        id: generateId(),
        name: name,
        number: number
    }

    contacts = contacts.concat(newContact)
    res.json(newContact)
})

app.listen(PORT, () => {
    console.log('Listening on port', PORT)
    
})
