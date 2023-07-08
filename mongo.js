// create a mongo.js file -- done
// add entries to phonebook
    // set up a contact schema
    // set up a phonebook modal
// list all existing entries in phonebook

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
} 

// if password includes special characters, this will encode into URI
const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://hahnb:${password}@phonebook.mkgt8uc.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

// contact info schema
const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contacts = mongoose.model('Contact', contactSchema)

// [ command line input: node mongo.js {password} ]
// expect to print out all currently existing entries from collection
if (process.argv.length === 3) {
  console.log('All phonebook entries will be retrieved here:');

  Contacts
    .find({})
    .then(result => {
      result.forEach(person => {
      console.log(person)

      mongoose.connection.close()
    })
  })
}

// [ command line input: node mongo.js {password} personName telephoneNumber  ]
// expect to add the person's contact info into collection
else if (process.argv.length === 5) {
  const nameToAdd = process.argv[3]
  const numberToAdd = process.argv[4]
  
  console.log(`Adding ${nameToAdd}'s number ${numberToAdd} to phonebook...`)

  const contactToAdd = new Contact({
    name: nameToAdd,
    number: numberToAdd
  })

  contactToAdd
    .save()
    .then(result => {
      console.log('Successfully added person!')
      mongoose.connection.close()
    })
}

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//   content: 'HTML is Easy',
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })