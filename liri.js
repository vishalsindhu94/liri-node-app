require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");

var userCommand = process.argv[2];
var userInput = process.argv[3];
UserInputs(userCommand, userInput);

function UserInputs (userCommand, userInput){
switch (userCommand){
    case "concert-this":
    concert(userInput);
    break;
    case "spotify-this-song":
    spotify(userInput);
    break;
    case "movie-this":
    movie(userInput);
    break;
    case "do-what-it-says":
    random(userInput);
    break;
}
}

function concert(userInput){
    axios.get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp")
    .then(
        function(response) {
            for (var i = 0; i < response.length; i++) {  
                console.log("Name of the venue- " + response.data[i].venue.name);
                console.log("Location- " +  response.data[i].venue.city);
                console.log("Date of the Event- " +  response.data[i].datetime.moment().format("MMM Do YYYY"));
            }
        });
}

function spotify(userInput) {
    if (userInput === undefined) {
        userInput = "The Sign";
    }
    spotify.search(
        {
            type: "track",
            query: userInput
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }
            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
              console.log("Artist(s)- "+ data.tracks.items[i].artists[0].name);
              console.log("Song's name- "+ data.tracks.items[i].name);
              console.log("Preview link "+ data.tracks.items[i].external_urls.spotify);
              console.log("Album- " + data.tracks.items[i].album.name);
             }
        }
    );
};

function movie(userInput){
    if (userInput === undefined) {
        userInput = "Mr. Nobody";
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    }
    axios.get("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy").then(
        function(response) {

        console.log("Title- " + response.data.Title);
        console.log("Release Year- " + response.data.Year);
        console.log("IMDB Rating- " + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating- " + response.data.Ratings[1].value)    ;
        console.log("Country of Production- " + response.data.Country);
        console.log("Language- " + response.data.Language);
        console.log("Plot- " + response.data.Plot);
        console.log("Actors- " + response.data.Actors); 
    });
};

function random(){
	fs.readFile("random.txt", "utf8", function(err, data){
		if (err){ 
			return console.log(err);
		}
        var dataArr = data.split(",");
        UserInputs(dataArr[0], dataArr[1]);
	});
}
  


