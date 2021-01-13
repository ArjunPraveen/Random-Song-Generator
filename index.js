const express = require("express");
const axios = require('axios')
const fetch = require("node-fetch");
const app = express();
const path = require('path')
app.use(express.json({ extended: false }));

require('dotenv').config();
const PORT = process.env.PORT || 5000;
var auth_token ;
app.post('/spotify-client-auth', async (req,res) => {
    try {
        console.log(process.env.AUTHTOKEN)
        const result = await fetch(
            'https://accounts.spotify.com/api/token',
             {
                 method : 'POST',
                body : 'grant_type=client_credentials',
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'Authorization' : process.env.AUTHTOKEN
                }
            }
        )
        const data = await result.json()
        auth_token = data.access_token
        console.log(data)
        return res.send({msg: "Successfully authorized"})
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

app.post("/generate", async (req,res) => {
    try {
        const searchstring = req.body.string;
        console.log(auth_token)
        const result = await fetch(
            `https://api.spotify.com/v1/search?type=track&market=US&limit=10&offset=1000&q=${searchstring}` ,
            {
                method: 'GET',
                headers: {
                    'Authorization' : 'Bearer ' + auth_token,
                    'Accept': 'application/json',
                    'Content-Type' : 'application/json'
                },
                
            }
        ) 
        const data = await result.json()
        return res.send(data)
    } catch (err) {
        console.log(err)
        res.send({msg:err})
    }
})
//production
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req,res)=> {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}
app.listen(PORT, () => console.log(`Running on port ${PORT}`));


