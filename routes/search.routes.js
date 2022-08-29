const { Router } = require('express');
const { searchCharacter } = require('../controllers/searchCoontroller');

const router = Router();

router.get('/', searchCharacter);

module.exports = router;