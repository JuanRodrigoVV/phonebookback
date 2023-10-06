const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')
const cors = require('cors')
app.use(express.static('dist'))



let persons = [
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


morgan.token('body', ((req) => JSON.stringify(req.body)))

app.use(morgan('tiny'))
app.use(morgan(':body'))
app.use(cors())

const PORT = process.env.PORT || 3002


app.listen(PORT, () => {
    console.log(`App listening on Port: ${PORT}`)
})

app.get(`/`, (req, res) => {
    res.send('<h1>Welcome to Persons</h1>')
})


app.get('/api/persons', (req, res) => {
    res.json(persons)
})



app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(per => per.id === id)
    if (person) {
        res.json(person)
    } else { 
        return res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    const currentDate = new Date();
    res.send(`Ponebook has info for ${persons.length} persons <br/>
    Date: ${currentDate}`)
})


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(note => note.id !== id)
    res.status(204).end()
})



const generateId = () => {
    return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (req, res) => {
    const body = req.body 
    const name = persons.find(per => per.name.toUpperCase() === body.name.toUpperCase())
    if (!body.name || !body.number) { 
        return res.status(400).json({error: "You are missing some content"}) 
    } else if (name) {
       return res.status(403).json(' the name is already in the list')
    }
    const person = {
            name: body.name,
            number: body.number,
            id: generateId(),
        }
        persons = persons.concat(person)
        res.json(person)
    
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



