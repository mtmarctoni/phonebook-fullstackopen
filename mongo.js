require('dotenv').config()
const mongoose = require('mongoose')

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

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Person = mongoose.model('Person', personSchema)

module.exports = Person


/*
const person = new Person({
    name: 'great',
    number: '387483743',  
})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})
*/