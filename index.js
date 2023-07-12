const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Contacts = require('./models/contact')

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
app.get('/api/persons/:id', (request, response) => {
    Contacts.findById(request.params.id).then(person => {
      response.json(person)
    })
})

// // DELETE request
app.delete('./api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(person => person.id !== id)

  response.status(204).end()
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

  // if (body.content === undefined) {
  //   return response.status(400).json({ error: 'content missing' })
  // }

  const person = new Contacts({
    name: body.name,
    number: body.number
  })

  person.save().then(savedContact => {
    response.json(savedContact)
  }) 
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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})