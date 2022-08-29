const { response } = require("express");
const { addMovieIfNotExist } = require("../helpers/db-validators");
const { uploadFile } = require("../helpers/upload-file");
const Character = require("../models/Characters");
const uuid = require('uuid').v4;

const getCharacters = async (req, res = response) => {
    const characters = await Character.findAll();

    return res.json({
        ok: true,
        characters
    });
}

const getDetailCharacter = async (req, res = response) => {
    const { id } = req.params;
    const character = await Character.findOne({ where: { id } });
    if(!character) {
        return res.status(400).json({
            ok: false,
            message: 'The character does not exist'
        });
    }

    return res.json({
        ok: true,
        character
    });
}

const addCharacter = async (req, res = response) => {
    const { name, age, weight, history, movies = null } = req.body;
    const userId = req.user.id;
    let moviesArray;

    const existCharacter = await Character.findOne({ where: { name } });
    if( existCharacter ){
        return res.status(400).send({
            ok: false,
            message: 'This character already exists in db'
        })
    }

    // upload image
    image = await uploadFile(req.files, undefined, 'characters');

    if (movies) {
        moviesArray = await addMovieIfNotExist(movies, userId, name);
    }

    // create record in the database
    const character = await Character.create({
        id: uuid(),
        image,
        name,
        age,
        weight,
        history,
        movies_series: moviesArray,
        userId
    })

    return res.json({
        ok: true,
        message: 'Character added successfully',
        character
    });
}

const updateCharacter = async (req, res = response) => {
    const { id } = req.params;
    const { name, age, weight, history, movies = null } = req.body;
    const userId = req.user.id;
    let moviesArray
    
    
    const character = await Character.findOne({ where: { id } });
    if(!character) {
        return res.status(400).json({
            ok: false,
            message: 'The character does not exist'
        });
    }

    if (movies) moviesArray = await addMovieIfNotExist(movies, userId, character.name);
    moviesArray = moviesArray.map( movie => {
        if( !character.movies_series.includes(movie) ) {
            return movie;
        }
    });
    moviesArray = moviesArray.filter( movie => movie !== undefined )

    const data = {
        name,
        age,
        weight,
        history,
        movies_series: [ ...character.movies_series, ...moviesArray ]
    }

    await Character.update(data, { where: { id } });

    return res.json({
        ok: true,
        message: 'Character updated successfully',
    });

}

const deleteCharacter = async (req, res = response) => {
    const { id } = req.params;
    const userId = req.user.id;

    const character = await Character.findOne({ where: { id } });
    if( !character ) {
        return res.status(404).send({
            ok: false,
            message: 'The movie was not found'
        })
    }

    if( character.userId !== userId ) {
        return res.status(400).json({
            ok: false,
            message: 'You can only delete records that you created'
        });
    }

    character.destroy();

    return res.json({
        ok: true,
        message: 'Character deleted successfully',
    });
}

module.exports = {
    getCharacters,
    getDetailCharacter,
    addCharacter,
    updateCharacter,
    deleteCharacter
}