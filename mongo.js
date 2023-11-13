require('dotenv').config()
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const commandLineUsage = require('command-line-usage')
const commandLineArgs = require('command-line-args')
const readline = require('readline')

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
  { name: 'method', alias: 'e', type: String, description: 'Operation type. Get, post, put, delete.', default: 'get' },
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

const readLineAsync = () => {
  const rl = readline.createInterface({
    input: process.stdin
  })
  return new Promise((resolve) => {
    rl.prompt()
    rl.on('line', (line) => {
      rl.close()
      resolve(line)
    })
  })
}

// Database
const con = async () => {
  const url = DB
  console.log('Connecting to database', url)
  mongoose.set('strictQuery', false)
  await mongoose.connect(url)
  console.log('connected')

  const Klass = require(`./models/${options.model}`)
  let obj_json // TODO: could be read from a file.
  if ( method === 'get' ) {
    if ( options.id ) {
      const result = await Klass.findById(options.id)
      logger.info(result)
      mongoose.connection.close()
    } else  {
      const result = Klass.find({})
      result.forEach(obj => { logger.info(obj )})
      mongoose.connection.close()
    }
  }

  else if ( method === 'post' ) {
    if (!options.params) {
      printHelp()
    }
    obj_json = options.params
    obj_json = JSON.parse(obj_json)
    const obj = new Klass(obj_json)
    await obj.save()
    logger.info('Saved')
    mongoose.connection.close()

  } else if ( method === 'delete' ) {
    console.log('Are you sure? Delete all [Y/N] >')
    const line = await readLineAsync()
    if (line.toString() === 'Y') {
      await Klass.deleteMany({})
    }
    logger.info('done')
    mongoose.connection.close()
    // process.exit(1)

  } else if ( method === 'put' ) {
    logger.info('Put: Not working yet...')
    mongoose.connection.close()
  }

}

con()
