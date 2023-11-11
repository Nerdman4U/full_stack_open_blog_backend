require('dotenv').config()
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const commandLineUsage = require('command-line-usage')
const commandLineArgs = require('command-line-args')

const printHelp = (e) => {
  const sections = [
    {
      header: 'Use MongoDB from commandline.',
      content: 'Use GET, POST, DELETE and PUT to operate datebase.\n\n\
      GET: Working\n\
      POST: Working\n\
      DELETE/PUT: NOT WORKING'
    },
    {
      header: 'Options',
      optionList: optionDefinitions
    }
  ]
  const usage = commandLineUsage(sections)
  if (e) console.log(e.message)
  console.log(usage)
  process.exit(1)
}

const optionDefinitions = [
  { name: 'model', alias: 'm', type: String,  description: 'Model name, i.e. blog' },
  { name: 'method', alias: 'e', type: String, description: 'Operation type. Get, post, put, delete.', default: "get"},
  { name: 'id', alias: 'i', type: String, description: 'Identifier used to fetch one model.' },
  { name: 'help', alias: 'h', type: Boolean, description: 'Print this help.' },
  { name: 'db', alias: 'd', type: String, description: 'dev or test' },
  { name: 'params', alias: 'p', type: String, description: 'POST parameters json' }
]

let options = {}
try {
  options = commandLineArgs(optionDefinitions)
} catch(e) {
  printHelp(e)
}
logger.info(options)

let DB
if ( options.db === 'test')
  DB = process.env.TEST_MONGODB_URI
else {
  DB = process.env.MONGODB_URI
}

const method = options.method || 'get'

if ( options.help ) {
  printHelp()
}
if ( !options.model ) {
  printHelp()
}

// Database
const url = DB
console.log('Connecting to database', url)
mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {console.log('connected')})
  .catch((e) => {console.log('error connecting, e:', e)})

// Model
// TODO: Generic
const Klass = require(`./models/${options.model}`)

let obj_json // TODO: could be read from a file.
if ( method === 'get' ) {
  if ( options.id ) {
    Klass.findById(options.id).then(result => {
      logger.info(result)
    }).finally(() => {
      mongoose.connection.close()
    })
  } else  {
    Klass.find({}).then(result => {
      result.forEach(obj => { logger.info(obj )})
    }).finally(() => {
      mongoose.connection.close()
    })

  }
}
else if ( method === 'post' ) {
  if (!options.params) {
    printHelp()
  }
  obj_json = options.params
  obj_json = JSON.parse(obj_json)
  const obj = new Klass(obj_json)

  obj.save().then(() => {
    logger.info('Saved')
  }).finally(() => {
    mongoose.connection.close()
  })
} else if ( method === 'delete' ) {
  logger.info('Delete: Not working yet...')
  mongoose.connection.close()
} else if ( method === 'put' ) {
  logger.info('Put: Not working yet...')
  mongoose.connection.close()
}



