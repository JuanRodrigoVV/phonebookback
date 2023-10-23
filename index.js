require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')
const cors = require('cors')
app.use(express.static('dist'))
const User = require('./models/users')
const { response } = require('express')


morgan.token('body', ((req) => JSON.stringify(req.body)))

app.use(morgan('tiny'))
app.use(morgan(':body'))
app.use(cors())

const PORT = process.env.PORT || 3002


app.listen(PORT, () => {
    console.log(`App listening on Port: ${PORT}`)
})




app.get('/api/persons', (req, res) => {
    User.find({}).then(person => {
        res.json(person)
      })
})


app.get('/api/persons/:id', (req, res, next) => {
    User.findById(req.params.id)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})




app.get('/info', (req, res) => {
    const currentDate = new Date();
    User.find({}).then(person => {
      res.send(`Ponebook has info for ${person.length} persons <br/>
      // Date: ${currentDate}`)
    })

})


app.delete('/api/persons/:id', (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  const user = {
    name: body.name,
    number: body.number,
  }

  User.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedUser => {
      response.json(updatedUser)
    })
    .catch(error => next(error))
})



app.post('/api/persons', (req, res, next) => {
    const body = req.body 
    if (!body.name || !body.number) { 
        return res.status(400).json({error: "You are missing some content"}) 
    } else 
    {const person = new User({
            name: body.name,
            number: body.number,

        })
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
    .catch(error => next(error))
  }
    
    
    
})


app.put('/api/persons/:id', (req, res) => {
    res.status(101)

})


// Midlewares

//Print Every Request
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(requestLogger)

// Catch bad urls

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)



  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).send({error: error.message})
    }
  
    next(error)
  }
  
  // this has to be the last loaded middleware.
  app.use(errorHandler)


