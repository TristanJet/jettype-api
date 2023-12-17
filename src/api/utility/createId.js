const { nanoid } = require('nanoid')

const createId = () => {
  return nanoid(8)
}

module.exports = createId