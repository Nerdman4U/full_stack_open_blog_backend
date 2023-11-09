const app = require('./app.js')
const logger = require('./utils/logger')
const config = require('./config')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

