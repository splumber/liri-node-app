require("dotenv").config();

//get keys from key file
// key file gets keys from .env
// twitter and spotify obtained from npm
// fs require to write text in random.txt
var keys = require('./keys');
var request = require('request');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var fs = require('fs');

// obtained from npm twitter
var client = new twitter(keys.twitter);
var spotify = new spotify(keys.spotify)


var nodeArg = process.argv;
var pick = process.argv[2];

var input = "";

for (var i = 3; i < nodeArg.length; i++) {
    if ((i > 3) && (i < nodeArg.length)) {
        input = input + "+" + nodeArg[i];
    } else {
        input = input + nodeArg[i];
    }
}

switch (pick) {
    case 'my-tweets':
        tweets();

        break;

    case 'spotify-this-song':
        if (input) {
            music(input);

        } else {
            music('The Sign');

        }
        break;

        // OMDB DONE!
    case 'movie-this':
        if (input) {
            omdb(input);
        } else {
            omdb('Mr. Nobody');
        }
        break;

    case 'do-what-it-says':
        notSiri();
        break;

    default:
        console.log("Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says");
        break;
}

function tweets() {
    var username = {
        screen_name: 'sajjad_p_411'
    };
    client.get('statuses/user_timeline', username, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@sajjad_p_411: " + tweets[i].text + " " + "Tweeted at: " + date.substring(0, 19));

                //BONUS add tweets to log.txt
                
                log("@sajjad_p_411: " + tweets[i].text + " " + "Tweeted at: " + date.substring(0, 19));
                log("TWEET TWEET");
                log("----------------------------------");
            }
        } else {
            console.log('twitter error has occured')
        }
    })
}

function music(song) {
    spotify.search({
        type: 'track',
        query: song
    }, function (error, data) {
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songdata = data.tracks.items[i];
                console.log("---------------------------------");
                console.log("Track Name: " + songdata.name);
                console.log("Artist: " + songdata.artists[0].name);
                console.log("Album: " + songdata.album.name);
                console.log("URL: " + songdata.preview_url);
                console.log("---------------------------------");

                // BONUS add music to log.txt
                log("---------------------------------");
                log("Track Name: " + songdata.name);
                log("Artist: " + songdata.artists[0].name);
                log("Album: " + songdata.album.name);
                log("URL: " + songdata.preview_url);
                log("---------------------------------");
            }
        } else {
            console.log("Spotify ERROR!");
        }
    });
}


function omdb(movieName) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);

            //BONUS add movie to log.txt
            log("Title: " + JSON.parse(body).Title);
            log("Release Year: " + JSON.parse(body).Year);
            log("IMDB Rating: " + JSON.parse(body).imdbRating);
            log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
            log("Country: " + JSON.parse(body).Country);
            log("Language: " + JSON.parse(body).Language);
            log("Plot: " + JSON.parse(body).Plot);
            log("Actors: " + JSON.parse(body).Actors);
        } else {
            console.log("OMDB ERROR!");
        }
        if (movieName === "Mr. Nobody") {
            console.log("-------------");
            console.log("If you haven't watched 'Mr. Nobody', then you should: <http://www.imdb.com/title/tt0485947/>");
            console.log("It's on Netflix!");

            log("-------------");
            log("If you haven't watched 'Mr. Nobody', then you should: <http://www.imdb.com/title/tt0485947/>");
            log("It's on Netflix!");
        }

    });
}

function notSiri() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        // DO NOT PUT SPACES AROUND COMMA: random.txt has no spaces
        var txt = data.split(',');
        music(txt[1]);
    });
}

function log(logging){
    fs.appendFile('log.txt', logging, function(error){
        if(error){
            throw error;
        }
    });
}