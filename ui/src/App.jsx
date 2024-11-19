import { useEffect, useState } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import Notification from './components/Notification'
import { getAll, addContact, updateContact, deleteContact } from './services/persons'

/*
const personList = [
  { name: 'Arto Hellas', number: '040-123456', id: 1 },
  { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
  { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
  { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
]
*/

const App = () => {
  const [persons, setPersons] = useState([])
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({message: null, type: null})

  useEffect(() => { 
    getAll()
      .then(persons => setPersons(persons))
      .catch(err => console.log(err.message))

  }, [])
  
  // explain in detail why this works...
  useEffect(() => {
    if (notification.message !== null) {
      const timer = setTimeout(() => {
        setNotification({message: null, type: null})
      }, 3000)
      return () => clearTimeout(timer)
    }
    
  }, [notification])

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const existingPerson = persons.find(person => person.name === e.target.name.value)
    
    if (existingPerson) {
      if (window.confirm(`${e.target.name.value} is already added to phonebook, do you want to replace the number with the new one?`)) {

        const updatedPerson = { ...existingPerson, number: e.target.number.value }
        updateContact(updatedPerson)
          .then(res => {
             const newPersons = persons.map(person => person.id === existingPerson.id ? updatedPerson : person)
            //console.log(newPersons);
            
            setPersons(newPersons)
            setNotification({
              message: `${updatedPerson.name}'s number has been successfully updated`,
              type: 'success'
            })
          })
          .catch(err => {
            setNotification({
              message: `${err.message}`,
              type: 'error'
            })
        })
      }

      return
    }
    
    const newPerson = {
      id: e.target.name.value,
      name: e.target.name.value,
      number: e.target.number.value
    }

    const newPersons = [...persons, newPerson]
    setPersons(newPersons)

    addContact(newPerson)
      .then(res => {
        setName('')
        setNumber('')
        
        setNotification({
          message: `${newPerson.name} has been successfully added`,
          type: 'success'
        })
      })   
  }

  const handleDeletePerson = (id) => {
    if (window.confirm(`Delete ${id}?`)) {
      deleteContact(id)
        .then(() => {
          const newPersons = persons.filter(person => person.id !== id)
          setPersons(newPersons)
          setNotification({
            message: `Contact ${id} has been deleted`,
            type: 'success'
          })
        })
    }
  
  }

  const showPersons = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons
  
  
  
  return (
    <main>
      <h1>Phonebook</h1>
      <Notification notification={notification} />
      <Filter filter={filter} onFilter={handleFilterChange} />
      <h3>Add a new contact</h3>
      <PersonForm
        name={name}
        number={number}
        setName={setName}
        setNumber={setNumber}
        onSubmit={handleSubmit} />
      <h3>Numbers</h3>
      <Persons showPersons={showPersons} onDeleteContact={handleDeletePerson} />
    </main>
  )
}

export default App
