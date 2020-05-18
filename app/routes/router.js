module.exports = (app) => {
    const sqsController = require('../controller/SQS_crud.controller')

    app.post('/sendData', sqsController.create)
    app.get('/receiveData', sqsController.retrive)

}