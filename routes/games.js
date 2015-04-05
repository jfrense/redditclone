var mongo = require("mongodb");


var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('gamedb', server);
var connection = db.open(function(err, db) {

  if(!err) {
  console.log("Connected to gameapp database");
  db.collection('games',{strict: true},function(err, collection){

    if(err) {
      console.log("cant connect to db");
    }


  });


}

});


exports.findData = function(req, res){
  db.collection('games', function(err, collection){
    var object = req.query;
    for(var key in object){
      if(Number.isNaN(parseInt(object[key])))
      console.log("Invalid value in key:value object. It must be a number");

   else  object[key] = parseInt(object[key]);

  }
   collection.find(object).toArray(function(err,items){
    //  var result = JSON.stringify(items);
      res.json(items);
   });

});

};
