require("dotenv").config();
var axios = require('axios');
var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require('fs');
var spotify = new Spotify(keys.spotify);

var types = {
    'concert-this': artist => {
        axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
            .then(result => {
                result.data.forEach(value => {
                    console.log(`Name: ${value.venue.name} | City: ${value.venue.city} | Time: ${moment(value.datetime).format('L')}`)
                })
            })
    },
    'spotify-this-song': song => {
        if(!song) song = "The Sign";
        spotify
            .search({type: 'track', query: song})
            .then(result => {
                result.tracks.items.forEach(value => {
                    console.log(`Artist: ${value.artists[0].name} | Song: ${value.name} | Album: ${value.album.name} | Preview: ${value.artists[0].external_urls.spotify}`)
                })
            })
    },
    'movie-this': movie => {
        if(!movie) movie = "Mr. Nobody";
        axios.get(`http://www.omdbapi.com/?apikey=trilogy&type=movie&t=${movie}`)
            .then(result => {
                console.log(`Title: ${result.data.Title}\nYear: ${result.data.Year}\nRating: ${result.data.Rated}\nRotten Tomatoes: ${result.data.Ratings[1].Value}\nCountry: ${result.data.Country}\nLanguage: ${result.data.Language}\nPlot: ${result.data.Plot}\nActors: ${result.data.Actors}`);
            })
    },
    'do-what-it-says': data => {
        fs.readFile(data, 'utf8', (err, info) => {
            if(!err) types[info.split(',')[0]](info.split(',')[1]);
        })
    }
}

types[process.argv[2]](process.argv[3]);