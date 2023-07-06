const cors = require("cors")
const express = require("express")
const morgan = require("morgan")
const Person = require('./models/person.js')
const person = require("./models/person.js")


const app = express()

app.use(cors())

app.use(express.static("build"))

app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// let persons =  [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

 

app.get('/api/persons/' , (request , response) => {
  Person.find({}).then(
    persons =>{ 
      console.log(persons)
      response.json(persons)
    }
  )
})

app.get('/api/persons/:id' ,(request , response )=> {
  const id = request.params.id
  Person.findById(id).then( person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id' ,(request , response )=> {
  const id = Number(request.params.id)
  persons = persons.filter( person => person.id !== id )
  response.status(204).end()
})


app.get('/info/' , (request, response ) => {
  response.send(
    "<p>phone book has info for 2 peopple</p><p id='a'></p> <script> document.getElementById('a').innerHTML = new Date()</script>"
  )
})

app.post('/api/persons' , (request, response)=>{
  const body = request.body 
  // console.log(body)

  if( !body.name ) {
    return response.status(400).json({
      error: "name not specified"
    })
  }

  if( !body.number ) {
    return response.status(400).json({
      error: "number not specified"
    })
  }

  const person = new Person({
    name : body.name, 
    number : body.number
  })

  person.save().then(
    person => {
      response.json(person)
    })
    
})

const generateId = ()=> Math.floor(Math.random() * 100000)

const PORT = process.env.PORT || "8080"

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
