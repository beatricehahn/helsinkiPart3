const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Contacts = require('./models/contact')

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

//app.use(morgan(':method :url :response-time '))
morgan.token('req-body', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :response-time ms - :req-body', {
    skip: (req) => req.method !== 'POST'
  })
)

let contacts = []

// handles HTTP GET requests made to the contacts path
app.get('/api/persons', (request, response) => {
  Contacts
    .find({})
    .then(notes => {
      response.json(notes)
    })
})

// // handles GET request for single resource (one person)
app.get('/api/persons/:id', (request, response, next) => {
  Contacts.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }

    })
    .catch(error => next(error))
})

// // DELETE request
app.delete('/api/persons/:id', (request, response, next) => {
  Contacts.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// const generateId = () => {
//   const newId = contacts.length > 0
//     ? Math.max(...contacts.map(i => i.id))
//     : 0
//   return newId + 1
// }

// POST request
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'Name is missing' })
  }

  const person = new Contacts({
    name: body.name,
    number: body.number
  })

  person.save().then(savedContact => {
    response.json(savedContact)
  }) 
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Contacts.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

// app.get('/info', (request, response) => {
//     const numPersons = contacts.length
//     const currentDate = new Date()
//     response.send(
//         `<p>Phonebook has info for ${numPersons} people</p>
//         </br>
//         <p>${currentDate}</p>`
//     )
// })

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})