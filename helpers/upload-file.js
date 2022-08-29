const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, validExtensions = ['png', 'jpg', 'gif', 'jpeg', 'PNG', 'JPG', 'GIF', 'JPEG'], folder = '' ) => {

    return new Promise((resolve, reject) => {
        const { file } = files;
        const cutName = file.name.split('.');
        const extension = cutName[cutName.length - 1].toLowerCase();

        // validar la extension
        if (!validExtensions.includes(extension)) {
            return reject (`the extension ${extension} is invalid - ${validExtensions}`);
        }

        const nameTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, nameTemp);

        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve( nameTemp );
        });
    })
}

module.exports = {
    uploadFile
}