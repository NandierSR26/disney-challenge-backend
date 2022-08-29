const uuid = require('uuid').v4;
const Character = require("../models/Characters");
const Gender = require('../models/Gender');
const MoviesSeries = require("../models/Movies-Series");

const addCharacterIfNotExist = async (characters = '', userId, title) => { 

    let movie = title.toUpperCase();

    // convert String to Array
    let movies_series = title.split(',');
    movies_series = movies_series.map(movie => movie.trim().toUpperCase());
    
    let charactersArray = characters.split(',');
    charactersArray = charactersArray.map(character => character.trim().toUpperCase());

    // verify that the characters exist
    charactersArray = charactersArray.map(async (name, i) => {
        const characterExist = await Character.findOne({ where: { name } });
        if (!characterExist) {
            await Character.create({
                id: uuid(),
                name,
                movies_series,
                userId
            })
        } else {
            await Character.update(
                { movies_series: [ ...characterExist.movies_series, movie ] },
                { where : { name }}
            )
        }

        return name
    })

    charactersArray = await Promise.all(charactersArray);
    charactersArray = charactersArray.filter(character => character !== undefined);
    
    return charactersArray;
}

const addMovieIfNotExist = async (movies = '', userId, name) => {
    
    let character = name.toUpperCase();

    // convert String to Array
    let characters = name.split(',');
    characters = characters.map(character => character.trim().toUpperCase());
    
    let moviesArray = movies.split(',');
    moviesArray = moviesArray.map(movie => movie.trim().toUpperCase());

    // verify that the characters exist
    moviesArray = moviesArray.map(async (title, i) => {
        const movieExist = await MoviesSeries.findOne({ where: { title } });
        if (!movieExist) {
            await MoviesSeries.create({
                id: uuid(),
                title,
                characters,
                userId
            })
        } else {
            await MoviesSeries.update(
                { movies_series: [ ...movieExist.characters, character ] },
                { where : { name }}
            )
        }

        return title
    })

    moviesArray = await Promise.all(moviesArray);
    moviesArray = moviesArray.filter(movie => movie !== undefined);
    
    return moviesArray;
}

const addGenderIfNotExist = async ( gender, movie ) => {
    let title = movie.toUpperCase();
    let name = gender.toUpperCase();
    
    const genderExist = await Gender.findOne({ where: { name } })
    if( !genderExist ) {
        await Gender.create({
            id: uuid(),
            name,
            movies_series: [ title ]
        })
    } else {
        await Gender.update(
            { movies_series: [ ...genderExist.movies_series, title ] },
            { where: { name } }
        )
    }

    return name;

}

const updateGenders = async ( movie ) => {
    let title = movie.toUpperCase();
    let movies_series = []

    const movieInUpdating = await MoviesSeries.findOne({ where: { title } });
    // console.log(movieInUpdating);
    
    if( movieInUpdating.gender ) {
        const genderUpdating = await Gender.findOne({ where: { name : movieInUpdating.gender } });

        if( genderUpdating.movies_series.includes(title) ) {
            movies_series = genderUpdating.movies_series;
            let index = movies_series.indexOf(title)
            movies_series.splice(index, 1);
            await Gender.update(
                { movies_series },
                { where: { name : movieInUpdating.gender }}
            )
        }
    }
}

module.exports = {
    addCharacterIfNotExist,
    addMovieIfNotExist,
    addGenderIfNotExist,
    updateGenders
}