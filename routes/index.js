const express = require("express");
const router = express.Router();
const spotify = require('./spotify')
const youtube = require('./youtube')

router.post('/spotify-client-auth', spotify.spotifyAuth);
router.post('/generate', spotify.generate);
router.post('/link', youtube.link)

module.exports = router