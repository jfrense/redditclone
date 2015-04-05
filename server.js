var express = require('express');
var  games = require('./routes/games');
var reddit = require('./routes/reddit');
var bodyParser  = require('body-parser');
var path = require('path');
var app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname + '/public')));

app.get('/reddit', function(req,res) {
  res.sendFile(__dirname + '/public/reddit.html');
  });

app.get('/api/games', games.findData);

app.get('/chatapp', function(req,res) {
  res.sendFile(__dirname + '/public/chat.html');
  });

app.get('/games', function(req,res) {
  res.sendFile(__dirname + '/public/game.html');
  });

app.get('/reddit/posts', reddit.getposts);

app.post('/reddit/posts', reddit.postposts);

app.param('post', reddit.parampost);

app.param('comment', reddit.paramcomment);

app.get('/reddit/posts/:post', reddit.getcomments);

app.put('/reddit/posts/:post/upvote', reddit.putupvote);

app.post('/reddit/posts/:post/comments', reddit.postcomments);

app.put('/reddit/posts/:post/comments/:comment/upvote',reddit.putcommentupvote);

// send all other requests to index.html page
app.get('*', function(req,res) {
  res.sendFile(__dirname + '/public/index.html');
  });


app.listen(80);
console.log('Listening on port 80..');
