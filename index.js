const express = require('express')
const app = express()

const morgan = require('morgan')

const cors = require('cors')

app.use(cors())
app.use(express.json())

//app.use(morgan(':method :url :response-time '))
morgan.token('req-body', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :response-time ms - :req-body', {
    skip: (req) => req.method !== 'POST'
  })
)


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

// handles GET request for single resource (one person)
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = contacts.find(person => person.id === id)

    if (person) {
      response.json(person)
    } else {
      response.status(400).end()
    }
})

// DELETE request
app.delete('./api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const newId = contacts.length > 0
    ? Math.max(...contacts.map(i => i.id))
    : 0
  return newId + 1
}

// POST request
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number is missing'
    })
  } else if (contacts.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  contacts = contacts.concat(newPerson)

  response.json(newPerson)
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