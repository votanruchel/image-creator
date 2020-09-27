const express = require('express');
const createImageModule = require('./src/services/index');
const path = require('path');
const fs = require('fs');
const app = express()

app.set('view engine', 'ejs');
app.use(express.json())
app.use('/static', express.static(__dirname + '/src/public'));

app.get('/', async(req, res) => {
    let backgrounds = [];
    const directoryPath = path.join(__dirname, '/src/public/backgrounds/');
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function(err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function(file) {

            backgrounds.push(file)

        });
        res.render(__dirname + '/src/views/index.ejs', { backgrounds });
    });

})

app.post('/create', createImageModule.createImage);

app.listen(3000);