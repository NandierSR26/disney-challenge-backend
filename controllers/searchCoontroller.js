const { response } = require("express");
const Character = require("../models/Characters");
const MoviesSeries = require("../models/Movies-Series");

const searchCharacter = async (req, res = response) => {
    const { name, age, movies } = req.query;
    let characters = [];

    const allCharacters = await Character.findAll();


    if (name) {
        const charactersByName = await Character.findAll({ where: { name : name.toUpperCase() } })
        characters = characters.concat(charactersByName)
    }

    if (age) {
        const charactersByAge = await Character.findAll({ where: { age } });
        characters = characters.concat(charactersByAge);
    }

    if (movies) {
        let charactersByMovies = allCharacters.map(character => {
            if (character.movies_series.includes(movies?.toUpperCase())) {
                return character
            }
        })
        characters = characters.concat(charactersByMovies);
    }

    characters = characters.filter( character => character !== undefined );

    return res.status(200).send({
        ok: true,
        characters
    })
}

const searchMovie = async(req, res = response) => {
    const { title, gender } = req.query;
    let movies = [];

    if(title) {
        const moviesByTitle = await MoviesSeries.findAll({ where : { title } });
        movies = movies.concat( moviesByTitle );
    }
    if(gender) {
        const moviesByGender = await MoviesSeries.findAll({ where : { gender } });
        movies = movies.concat( moviesByGender )
    }

    movies = movies.filter( movie => movie !== undefined );

    return res.status(200).send({
        ok: true,
        movies
    })
    
}

module.exports = {
    searchCharacter
}