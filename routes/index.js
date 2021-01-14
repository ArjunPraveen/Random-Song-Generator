const express = require("express");
const router = express.Router();
const spotify = require('./spotify')

router.post('/spotify-client-auth', spotify.spotifyAuth);
router.post('/generate', spotify.generate);

module.exports = router