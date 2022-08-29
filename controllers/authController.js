const { response } = require('express');
const Users = require('../models/users');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        // verificar si el email existe
        const user = await Users.findOne({ correo });
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: "the email does not exist"
            });
        }

        // verificar si el password es correcto
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "wrong password"
            });
        }

        // generar el token
        const token = await generateJWT(user.id);

        return res.json({
            user, 
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'talk to the admin',
        })
    }
}


const signUp = async(req, res = response) => {
    const { name, email, password } = req.body

    // verify if the email exists in db
    const user = await Users.findOne({ email });
    if(user) {
        return res.status(400).json({
            ok: false,
            msg: "the email already exists"
        });
    }

    // create the user
    const newUser = await Users.create({
        name,
        email,
        password,
    });

    // encrypt the password
    const salt = bcryptjs.genSaltSync();
    newUser.password = bcryptjs.hashSync(password, salt);

    await newUser.save();


    res.send({
        ok: true,
        msg: "user created"
    });
}

module.exports = {
    login,
    signUp
}