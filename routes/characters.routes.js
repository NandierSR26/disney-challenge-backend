const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJwt } = require('../middlewares/validate-jwt');
const { getCharacters, addCharacter, updateCharacter, deleteCharacter, getDetailCharacter } = require('../controllers/characterController')
const { verifyIfMovieExist } = require('../helpers/db-validators')

const router = Router();

// path to list all characters
router.get('/', [], getCharacters);

// path to view details of a character
router.get('/:id', [], getDetailCharacter);

// path to create a new character
router.post('/', [
    validateJwt,
    check('name').not().isEmpty().withMessage('Name is required'),
    check('age').not().isEmpty().withMessage('Age is required'),
    check('weight').not().isEmpty().withMessage('Weight is required'),
    check('history').not().isEmpty().withMessage('History is required'),
    // check('movies')
    //     .custom(verifyIfMovieExist)
    //     .withMessage('One or more movies do not exist, you can add them in the movies section, or add the character without the movie and after update it'),
        
    validateFields
], addCharacter);

// path to update a character
router.put('/:id', [
    validateJwt,
    validateFields
], updateCharacter);

// path to delete a character
router.delete('/:id', [
    validateJwt,
    validateFields
], deleteCharacter);

module.exports = router;