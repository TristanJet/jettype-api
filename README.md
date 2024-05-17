# Http and Websocket API for jettype.net

Websocket uses "ws", and http uses "express".

## 3 layers

1. Web layer. Responsible for sending, receiving, and validating HTTP requests. Common configuration here includes routes, controllers, and middleware.

2. Service layer. Contains business logic.

3. Data access layer. Where we read and write to a database. We typically use an ORM like Mongoose or Sequelize.

## Controller

The best practice for controllers is to keep them free of business logic. Their single job is to get any relevant data from the req object and dispatch it to services. The returned value should be ready to be sent in a response using res.

