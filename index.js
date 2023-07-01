const express = require('express')
const app = express()

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// event handler for root
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// handles HTTP GET requests made to the contacts path
app.get('/api/persons', (request, response) => {
    response.json(contacts)
})

app.get('/info', (request, response) => {
    const numPersons = contacts.length
    const currentDate = new Date()
    response.send(
        `<p>Phonebook has info for ${numPersons} people</p>
        </br>
        <p>${currentDate}</p>`
    )
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})