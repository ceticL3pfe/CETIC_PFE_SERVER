const router = require('express').Router();

const { 
    deleteTenderNotice,
    addTenderNotice,
    updateTenderNotice,
    getTenderNotices,
    getTenderNoticesArchive, getTenderNoticesActivity, deleteTenderNoticesArchive } = require('../controllers/tenderNotice')






router
    .get('/', getTenderNotices)
    .get('/activity', getTenderNoticesActivity)
    .get('/archive', getTenderNoticesArchive)
    .delete('/archive/:id', deleteTenderNoticesArchive)
    .delete('/:id', deleteTenderNotice)
    .post('/', addTenderNotice)
    .put('/:id', updateTenderNotice)










module.exports = router;