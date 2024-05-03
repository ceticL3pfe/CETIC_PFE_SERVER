const router = require('express').Router();

const {
    getFournisseur,
    addFournisseur,
    deleteFournisseur,
    
} = require('../controllers/fournisseur')







router
    .get('/', getFournisseur)
    .delete('/:fournisseurId', deleteFournisseur)
    .post('/', addFournisseur)










module.exports = router;