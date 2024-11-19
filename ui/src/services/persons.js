import axios from 'axios'
const apiUrl = '/api/persons' //http://localhost:3001/api/persons'

const getAll = () => {
    const req = axios.get(apiUrl)
    return req.then(res => res.data)
}

const addContact = (newPerson) => {
    const req = axios.post(apiUrl, newPerson)
    return req.then(res => res.data)
}

const updateContact = (updatedPerson) => {
    const id = updatedPerson.id
    const req = axios.put(`${apiUrl}/${id}`, updatedPerson)
    return req.then(res => res.data).catch(err => {
        if (err.response.status === 404) {
            throw new Error(`Contact ${id} has already been removed from the server`)
        } else {
            throw new Error('Fail to update contact')
        }
    })
}

const deleteContact = (id) => {
    const req = axios.delete(`${apiUrl}/${id}`)
    return req.then(res => res.data)
}

export {
    getAll,
    addContact,
    updateContact,
    deleteContact
}