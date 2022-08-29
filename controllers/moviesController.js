const { response } = require("express");
const uuid = require('uuid').v4;
const { addCharacterIfNotExist, addGenderIfNotExist, updateGenders } = require("../helpers/db-validators");
const { uploadFile } = require("../helpers/upload-file");
const MoviesSeries = require("../models/Movies-Series");

const getMovies = async (req, res = response) => {
    const movies = await MoviesSeries.findAll();

    return res.send({
        ok: true,
        movies
    });
}
const getMovie = async (req, res = response) => {
    const { id } = req.params
    const movie = await MoviesSeries.findByPk(id);

    if (!movie) {
        return res.status(404).send({
            ok: false,
            message: "The movie with the given id was not found"
        });
    }

    return res.send({
        ok: true,
        movie
    });
}
const addMovie = async (req, res = response) => {
    const { title, date, qualification, category, characters = null, gender = null } = req.body;
    const userId = req.user.id;
    let charactersArray;
    let newGender;
    
    const existMovie = await MoviesSeries.findOne({ where: { title : title.toUpperCase() } })
    if( existMovie ) {
        return res.status(400).send({
            ok: false,
            message: 'this movie exist in db'
        })
    }

    // save the image
    const image = await uploadFile(req.files, undefined, 'movies');

    if ( gender ) {
        newGender = await addGenderIfNotExist( gender, title );
        console.log(newGender);
    }
    
    if (characters) {
        charactersArray = await addCharacterIfNotExist(characters, userId, title);
    }

    // create the movie
    const movie = await MoviesSeries.create({
        id: uuid(),
        image,
        title,
        date,
        qualification,
        category,
        characters: charactersArray,
        gender: newGender,
        userId
    });

    return res.send({
        ok: true,
        message: "The movie was created successfully",
        movie
    });
}

const updateMovie = async (req, res = response) => {
    const { id } = req.params;
    const { title, date, qualification, category, characters = null, gender } = req.body;
    const userId = req.user.id;
    let charactersArray = [], newGender;

    const movie = await MoviesSeries.findOne({ where: { id } })
    if (!movie) {
        return res.status(404).send({
            ok: false,
            message: "The movie was not found",
        })
    }

    if (characters) {
        charactersArray = await addCharacterIfNotExist(characters, userId, movie.title); 

        charactersArray = charactersArray.map(character => {
            if (!movie.characters.includes(character)) {
                return character;
            }
        })
        charactersArray = charactersArray.filter(character => character !== undefined);
    } 

    if( gender ) {
        await updateGenders( movie.title );
        newGender = await addGenderIfNotExist( gender, movie.title );
    }

    const data = {
        title, date, qualification, category, characters: [...movie.characters, ...charactersArray], gender: newGender
    }

    await MoviesSeries.update(data, { where: { id } });

    return res.status(200).json({
        ok: true,
        message: "The movie was updated successfully",
    })
}
const deleteMovie = async (req, res = response) => {
    const { id } = req.params;
    const userId = req.user.id;

    const movie = await MoviesSeries.findOne({ where: { id } })

    if (!movie) {
        return res.status(404).send({
            ok: false,
            message: "The movie was not found",
        })
    }

    if( movie.userId !== userId ) {
        return res.status(401).send({
            ok: false,
            message: 'you can only delete records that you created'
        })
    }

    await movie.destroy();

    return res.status(200).send({
        ok: true,
        message: 'The movie was deleted successfully'
    })
    
}

module.exports = {
    getMovies,
    getMovie,
    addMovie,
    updateMovie,
    deleteMovie,
}