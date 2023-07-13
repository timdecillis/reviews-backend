const fs = require('fs')
const path = require('path')
const { Pool, Client} = require('pg')
const copyFrom = require('pg-copy-streams').from
const config = require('./config.json')

// inputfile & target table
var inputFile = path.join(__dirname, '/data/customer.csv')
var table = 'usermanaged.customers'

// Getting connectin parameters from config.json
const host = config.host
const user = config.user
const pw = config.pw
const db = config.db
const port = config.port
const conString = `postgres://${user}:${pw}@${host}:${port}/${db}`