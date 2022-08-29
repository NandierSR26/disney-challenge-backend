const express = require('express');
const db = require('./config/db');
const fileUpload = require('express-fileupload');
require('dotenv').config({ path: '.env' });

const app = express();

const port = process.env.PORT || 8080;

// models
require('./models/Characters');
require('./models/Gender');
require('./models/Movies-Series');
require('./models/Users');

// create connection to the database
db.sync()
    .then(() => console.log('Conectado a la BD'))
    .catch(error => console.log(error));

// read and pass the body of the request
app.use(express.json());

// upload files
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
    createParentPath : true
}));

// paths
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/characters', require('./routes/characters.routes'));
app.use('/api/movies-series', require('./routes/movies.routes'));
app.use('/api/search', require('./routes/search.routes'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})