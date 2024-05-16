const router = require('express').Router();

const { 
    deleteTenderNotice,
    addTenderNotice,
    updateTenderNotice,
    getTenderNotices,
    getTenderNoticesArchive, getTenderNoticesActivity } = require('../controllers/tenderNotice')







router
    .get('/', getTenderNotices)
    .get('/activity', getTenderNoticesActivity)
    .get('/archive', getTenderNoticesArchive)
    .delete('/:id', deleteTenderNotice)
    .post('/', addTenderNotice)
    .put('/:id', updateTenderNotice)










module.exports = router;