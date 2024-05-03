const router = require('express').Router();

const {
    getClients,
    addClient,
    deleteClient,
    updateClient,
     } = require('../controllers/client')







router
    .get('/', getClients)
    .delete('/:clientId', deleteClient)
    .post('/', addClient)
    .put('/:id', updateClient)










module.exports = router;