const express = require('express');
const cntr = require('../../controllers/controllers');
const router = express.Router();
const isValidId = require('../../middlevares/isValidId');

router.get('/', cntr.getAll);
router.get('/:contactId', isValidId, cntr.getById);
router.post('/', cntr.addContact);
router.put('/:contactId', isValidId, cntr.changeContact);
router.patch('/:contactId', isValidId, cntr.changeFavorite);
router.delete('/:contactId', isValidId, cntr.deleteContact);

module.exports = router;
