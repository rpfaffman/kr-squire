const express = require('express')
const app = express()
const db = require('./db') 
const { PORT } = require('../env')

class Server {
  start() {
    return new Promise((res, rej) => {
      try {
        app.get('/', (req, res) => {
          db.failures.find().toArray((err, docs) => {
            res.send(docs)
          })
        })

        app.listen(PORT, () => {
          console.log('Server started on port', PORT)
        })
        res(app)
      } catch (e) { rej(e) }
    })
  }
}

module.exports = new Server()
