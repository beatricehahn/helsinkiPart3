// ============ mongoose code ============
const mongoose = require('mongoose')

// if password includes special characters, this will encode into URI
const password = encodeURIComponent(process.argv[3])

const url = process.env.MONGODB_URI

// const url = `mongodb+srv://hahnb:${password}@phonebook.mkgt8uc.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then(result => {
    console.log('Established connection with db');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  })

// contact schema
const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObbject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)