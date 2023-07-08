const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const Person = require('./models/person.js')



const app = express()

app.use(cors())

app.use(express.static("build"))

app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



 

app.get('/api/persons/' , (request , response) => {
  Person.find({}).then(
    persons =>{ 
      console.log(persons)
      response.json(persons)
    }
  )
})

app.get('/api/persons/:id' ,(request , response , next)=> {
  const id = request.params.id
  Person.findById(id).then( person => {
    if(person)
      response.json(person)
    else 
      response.status(404).end()
  }).catch(
    error => next(error)
  )
})

app.delete('/api/persons/:id' ,(request , response ,next)=> {
  Person.findByIdAndRemove(request.params.id).then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})


app.get('/info/' ,async (request, response ) => {
  const count = await Person.count({})
  response.send(
    `<p>phone book has info for ${count} people</p><p id='a'></p> <script> document.getElementById('a').innerHTML = new Date()</script>`
  )
})


app.put('/api/persons/:id' , (request, response, next ) => {
  const person = {
    name : request.body.name, 
    number : request.body.number
  }
  Person.findByIdAndUpdate(request.params.id , person , { new : true , runValidators : true , context : 'query'}).then( updatedPerson =>
    response.json(updatedPerson)
  ).catch(error => next(error))
})

app.post('/api/persons' , (request, response, next)=>{
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
  .catch( error => next(error))
})

const errorHandler = (error, request, response, next) =>{
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if ( error.name === 'ValidationError' ) 
    return response.status(400).send({ error: error.message })

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || "3001"

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
