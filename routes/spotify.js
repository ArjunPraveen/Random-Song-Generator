const fetch = require("node-fetch");
require('dotenv').config();


const exp = {};

const randomstring = () =>  {
    const characters = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz';
    
    const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
    let randomSearch = '';
    switch (Math.round(Math.random())) {
      case 0:
        randomSearch = randomCharacter + '%25';
        break;
      case 1:
        randomSearch = '%25' + randomCharacter + '%25';
        break;
    }
  
    return randomSearch;
  }

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
        console.log(err)
        res.send(err)
    }
}

exp.generate =  async (req,res) => {
    try {
        const searchstring = randomstring()
        const location = req.body.location
        //console.log(auth_token)
        const request = await fetch(
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
        const result = await request.json()
        var rand = Math.floor(Math.random() * 50)
        //console.log(result)
        if(result.error)
            return res.send({status: result.error.status})
        var songname = result.tracks.items[rand].name
        var artists = result.tracks.items[rand].artists
        var artists_string = '';
        var image = result.tracks.items[rand].album.images[0].url
        artists.length == 1 ? (artists_string = artists[0].name) : (
            artists_string = artists.map((elem)=> {
                return elem.name
            }).join(' | '))
        return res.send({song: songname, artists: artists_string, image: image, status:200})
    } catch (err) {
        console.log(err)
        res.send({error:err})
    }
}

module.exports = exp;