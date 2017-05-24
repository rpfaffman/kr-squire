const Mongo = require('mongodb').MongoClient
const { DB_URI } = require('../env')

class Db {
  connect() {
    return new Promise((res, rej) => {
      Mongo.connect(DB_URI, (err, db) => {
        if (err) return rej(err)
        this.db = db
        res(db)
      })
    })
  }

  migrate() {
    return new Promise((res, rej) => {
      this.db.createCollection('failures', {}, (err, coll) => {
        if (err) return rej(err)
        this.failures = coll
        res(coll)
      })
    })
  }
}

module.exports = new Db()
