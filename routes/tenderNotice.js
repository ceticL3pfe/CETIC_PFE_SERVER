const router = require('express').Router();

const { 
    deleteTenderNotice,
    addTenderNotice,
    updateTenderNotice,
    getTenderNotices } = require('../controllers/tenderNotice')







router
    .get('/', getTenderNotices)
    .delete('/:id', deleteTenderNotice)
    .post('/', addTenderNotice)
    .put('/:id', updateTenderNotice)










module.exports = router;