const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJwt } = require('../middlewares/validate-jwt');
const { getMovies, getMovie, addMovie, updateMovie, deleteMovie } = require('../controllers/moviesController');
const { validateIfCharacterExists } = require('../helpers/db-validators');

const router = Router();

// path for get all movies
router.get('/', [
    validateJwt,
    validateFields
], getMovies);

// path for get one movie
router.get('/:id', [
    validateJwt,
    validateFields
], getMovie);

// path for create movie
router.post('/', [
    validateJwt,
    // check('characters')
        // .custom(validateIfCharacterExists)
        // .withMessage('One or more characters do not exist, you can add them in the characters section, or add the movie without the character and after update it'),

    validateFields
], addMovie);

// path for update a movie
router.put('/:id', [
    validateJwt,
    validateFields
], updateMovie);

// path for delete a movie
router.delete('/:id', [
    validateJwt,
    validateFields
], deleteMovie);



module.exports = router;