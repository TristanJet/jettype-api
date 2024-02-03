const { nanoid } = require('nanoid');

const createId = () => nanoid(8);

module.exports = createId;
