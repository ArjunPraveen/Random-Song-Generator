const express = require("express");
const fetch = require("node-fetch");
const app = express();
const path = require('path')
const cors = require('cors');
app.use(express.json({ extended: false }));
app.use(cors())

require('dotenv').config();
const PORT = process.env.PORT || 5000;



//production
app.use('/', require('./routes'))
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req,res)=> {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })  
}
app.listen(PORT, () => console.log(`Running on port ${PORT}`));


