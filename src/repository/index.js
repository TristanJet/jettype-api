const persistent = require('./6379')
const mem = require('./6380')

module.exports = {
  ...persistent,
  ...mem
}