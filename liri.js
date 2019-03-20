require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require("fs");


var userCommand = process.argv[2];

switch (userCommand) {
    case "concert-this":
        var artists = "";
        if (process.argv.length > 3) {
            for (var i = 3; i < process.argv.length; i++) {
                artists = artists + " " + process.argv[i];
            }
        }
        artists = artists.trim();
        concert(artists);
        break;
    case "spotify-this-song":
        var song = "";
        if (process.argv.length > 3) {
            for (var i = 3; i < process.argv.length; i++) {
                song = song + " " + process.argv[i];
            }
            song = song.trim();
        }

        else
            song = "The Sign";
        spotifyThis(song);
        break;
    case "movie-this":
        var movie = "";
        if (process.argv.length > 3) {
            for (var i = 3; i < process.argv.length; i++) {
                movie = movie + " " + process.argv[i];
            }
            movie = movie.trim();
        }

        else
            movie = "Mr. Nobody";
        movieThis(movie);
        break;
    case "do-what-it-says":
        random();
        break;
    default:
        console.log("Invalid Option. options are:concert-this, spotify-this-song, movie-this, do-what-it-says")
}


function concert(bands) {
    if (bands === 0)
        console.log("no concert found for " + bands);

    else {
        axios.get("https://rest.bandsintown.com/artists/" + bands + "/events?app_id=codingbootcamp")
            .then(
                function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        console.log("Name of the venue- " + response.data[i].venue.name);
                        console.log("Location- " + response.data[i].venue.city);
                        console.log("Date of the Event- " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
                    }
                });
    }
}
function spotifyThis(song) {
    if (song === undefined) {
        song = "The Sign";
    }
    spotify.search(
        {
            type: "track",
            query: song
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }
            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log("Artist(s)- " + data.tracks.items[i].artists[0].name);
                console.log("Song's name- " + data.tracks.items[i].name);
                console.log("Preview link " + data.tracks.items[i].external_urls.spotify);
                console.log("Album- " + data.tracks.items[i].album.name);
            }
        }
    );
};

function movieThis(movie) {
    if (movie === undefined) {
        movie = "Mr. Nobody";
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    }
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
        function (response) {

            console.log("Title- " + response.data.Title);
            console.log("Release Year- " + response.data.Year);
            console.log("IMDB Rating- " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating- " + response.data.Ratings[1].value);
            console.log("Country of Production- " + response.data.Country);
            console.log("Language- " + response.data.Language);
            console.log("Plot- " + response.data.Plot);
            console.log("Actors- " + response.data.Actors);
        });
};

function random() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        var dataArr = data.split(",");
       console.log(dataArr[0],dataArr[1]);
        spotifyThis(dataArr[1]);
            
       
    });
}



