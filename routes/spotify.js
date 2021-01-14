const fetch = require("node-fetch");
require('dotenv').config();


const exp = {};

var auth_token ;
exp.spotifyAuth =  async (req,res) => {
    try {
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
        //console.log(data)
        return res.send({msg: "Successfully authorized"})
    } catch (err) {
        wconsole.log(err)
        res.send(err)
    }
}

exp.generate =  async (req,res) => {
    try {
        const searchstring = req.body.string;
        const location = req.body.location
        //console.log(auth_token)
        const result = await fetch(
            `https://api.spotify.com/v1/search?type=track&market=${location}&limit=50&offset=1000&q=${searchstring}` ,
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
}

module.exports = exp;