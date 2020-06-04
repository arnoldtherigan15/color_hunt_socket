if(process.env.NODE_ENV == 'development') {
    require('dotenv').config()
}

const express = require("express")
const app = express()
app.io = require('socket.io')()

const cors = require('cors')
const morgan = require('morgan')
const errorHandler = require('./middlewares/errorHandler')
const routes = require('./routes')(app.io)

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/',routes)
app.use(errorHandler)

module.exports = app