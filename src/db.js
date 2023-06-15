const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URLCONNECTION)

mongoose.connection.on('connected', () => {
  console.log("Mongoose connected")
})
mongoose.connection.on('disconnected', () => {
  console.log("Mongoose connected")
})
mongoose.connection.on('error', () => {
  console.log("Mongoose connected")
})

module.exports = mongoose
