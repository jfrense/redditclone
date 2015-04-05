var mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/reddit");

var PostSchema = new mongoose.Schema({
  text: String,
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

PostSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Post', PostSchema);

var CommentSchema = new mongoose.Schema({
  text: String,
  upvotes: {type: Number, default: 0},
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

CommentSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Comment', CommentSchema);

//This declares my classes for this server/app
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

exports.getposts = function(req, res, next){
  Post.find(function(err, posts){
    if (err) { return next(err); }
    res.json(posts);
  });
};

exports.postposts = function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });

};


exports.parampost = function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
};




exports.paramcomment = function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
};


exports.getcomments = function(req, res, next) {
  //this populate comes from mongoose, it loads up the comments associated with the post
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
};


exports.putupvote = function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
};



exports.postcomments = function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
};


exports.putcommentupvote = function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
};
