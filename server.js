//this is my server backend for the leaderboard app

//here we are importing the required tools
var http = require('http');
var express = require('express');
var bodyparser = require('body-parser');
var mysql = require('mysql');

//here we use the mysql node package to create a basic connection object using our DB login info
//to get this to work you MUST change lines 13 and 14 to reflect YOUR admin (or root user) and password
var dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'matt',
  password: 'matt222',
  database: 'leaderboard'
});

//here we attempt to connect to the server.
try{
  dbConnection.connect();
}
catch(e){//if it fails, we just print the error in the console
  console.log("Connecting to the DB failed: "+e);
}

//here, we're setting up the express middleware to help us deal with http requests.
var app = express();
//this parses the body of a post request to this server into the json format.
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
//setting the port for our app to port 5000
app.set('port', 5000);

//===============below we define routes for our restful API=============
//this is a standard route just in case someone tries to go here.
app.get('/', function(req, res){
  res.send('<html><body>welcome to the Leaderboard app.<br><br>please use instructions.txt to access the top 10 scores or add a score</body></html>');
});
//this route gets the top 10 scores out of all players.
app.get('/top10', function(req, res){
  var response = [];
  var cleanData;
  //first we query the DB for players, sorted by score, descending, with a limit of 10 rows returned.
  dbConnection.query('SELECT * FROM players order by score desc limit 10;', function(err, result){
    //then, we check if there was an error with the query request
    if (!err){//if not...
      //we then check to make sure that despite no error, our query actually returned data. (it might run correctly but just find nothing)
      if(result.affectedRows != 0){//if no query error AND we have rows affected...

          cleanData = result.forEach(function(row){
              response.push({player_name: row.player_name, score: row.score})
          });
          console.log("getting the top 10 scores");
      }
      else{//if there was no query error, BUT no data was found, return a successful status (because it DID run correctly), and a message about no data found.
        response.push({STATUS: 1, MSG:"No data found for that query"});
        console.log("attempted to get top ten scores. but none were found.");
      }

      //regardless, if we get here, we know the query ran correctly so our return status code should be 200
      res.setHeader('Content-Type', 'application/json');
      res.status(200);
      //actually return the selected info.
      res.send(JSON.stringify(response)); //we need to convert our JS object into a proper json object before we send it.
    }
    else{//if, however there IS an error with the query, simply return a message saying so with a failure status.
      response.push({STATUS: 0, ERR_MSG:"There was an error with the DB query: "+err});
      res.setHeader('Content-Type', 'application/json');
      res.status(500);
      //actually return the selected info.
      res.send(JSON.stringify(response)); //we need to convert our JS object into a proper json object before we send it.
      console.log('error with the DB query while trying to get top 10 scores');
    }
  });//end the connection.query function
});//end the get top10 route

//this route allows a user to post a score for a player
app.post('/postScore', function(req, res){
  var toSend ={};
  //first we check to make sure we've been given all the information we need to post a score: a player name and score
  var name;
  var newscore;
  if(req.body.score == undefined || req.body.player_name == undefined){
    console.log("score post attempted. but it was missing arguments");
    res.setHeader('Content-Type', 'application/json');
    res.status(400);
    res.send({STATUS: 0, ERR_MSG: "you need to enter both 'player_name' and 'score'"});
  }
  else{//if they did enter the info correctly, gather it.
    name = req.body.player_name;
    newscore = req.body.score;
    console.log("attempting to post a score of "+newscore+" for: "+name);
  }

  //next we query the DB for player whose name matches the one sent in
  dbConnection.query('SELECT score FROM players where player_name = ?;', [name], function(err, result){
    //then, we check if there was an error with the query request
    if (!err){//if not...
      //we then check to make sure that despite no error, our query actually returned data. (it might run correctly but just find nothing)
      if(result.length != 0){//if no query error AND we have rows affected...
        //here we check to see if the newscore is a higher or lower score than the one in the table
        if(parseInt(result[0].score, 10) < parseInt(newscore, 10))
        {
          //if it is higher, we update the table with the new score for that player.
          dbConnection.query('UPDATE players SET score = ? WHERE player_name = ?;', [newscore ,name], function(err2, result2){
            if(err2){//if there is an error during the update, fail out with a helpful message.
              console.log("something went wrong with the database update: "+ err2);
              res.setHeader('Content-Type', 'application/json');
              res.status(500);
              res.send({STATUS: 0, MSG: "something went wrong with the database update. please try again later: "+ err2});
            }
            else{//otherwise everything went ok, so we return that message.
              //note: we dont check for affectedRows = 0 here because from previous checks we know this player has a row already.
              console.log(name+"'s score has been updated to : "+newscore);
              res.setHeader('Content-Type', 'application/json');
              res.status(200);
              res.send({STATUS: 1, MSG: name+"'s score has been updated to : "+newscore});
            }
          });
        }
        else{
          //ifit's lower (or the same), we return a message about how its not a high score for that player. then exit out.
          console.log("An attempt has been made to modify "+name+"'s score, but their current score ("+result[0].score+") was already the same or greater than the new score of : "+newscore+". so the old score was kept.");
          res.setHeader('Content-Type', 'application/json');
          res.status(200);
          res.send({STATUS: 1, MSG: "Sorry, "+name+"'s current score ("+result[0].score+") was already the same or greater than the new score of : "+newscore+". so the old score was kept."});
        }
        //console.log(result);
      }//end rows affected check
      else{//if there was no select query error, BUT no data was found that means this player doesnt have a score yet. so just add it to the table
        dbConnection.query('INSERT INTO Players (player_name, score, created_date) VALUES (?,?, CURRENT_TIMESTAMP);', [name, newscore],
         function(err3, result3){
           if(err3){//if something goes wrong with the insert, fail out with a helpful message
             console.log("something went wrong while adding"+name+" as a new player to the DB: "+ err3);
             res.setHeader('Content-Type', 'application/json');
             res.status(500);
             res.send({STATUS: 0, MSG: "something went wrong while adding"+name+" as a new player to the DB: "+ err3});
           }
           else{//otherwise, everything went great and we tell the user that
             console.log(name+" has been added as a new player to the DB with a score of: "+newscore);
             res.setHeader('Content-Type', 'application/json');
             res.status(200);
             res.send({STATUS: 0, MSG: name+" has been added as a new player to the DB with a score of: "+newscore});
           }
         });//end the callback for the INSERT query
      }//end select query else
    }//end initial SELECT query error check if
    else{//otherwise, there WAS an error with the DB while finding the name initially
      console.log("There was an error while trying to find "+name+" in the DB: "+err);
      res.setHeader('Content-Type', 'application/json');
      res.status(500);
      res.send({STATUS: 0, MSG: "There was an error while trying to find "+name+" in the DB. please try again later: "+err});
    }
  });//end the connection.query function

});//end the get postScore route
//====================================here we end all the routes for this api ===================================

//here we tell the http module to create a server, and run our express app on it.
//then we tell that server to listen for http requests on the port we assigned during the express configuration (5000)
http.createServer(app).listen(app.get('port'), function(){
  console.log("server listening on port "+ app.get('port'));
});
