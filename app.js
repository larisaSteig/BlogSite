const express    = require ('express')
const bodyParser = require('body-parser')
const mongoose  = require('mongoose')
const blog = require('./models/blog')
const dotenv = require('dotenv').config()
const methodOverride = require('method-override');
const app        = express()
const expressSanitazer = require("express-sanitizer")
const Blog = require("./models/blog")


const mongoDB = process.env.MONGODB_URL;
//  *************************************************** Set up default mongoose connection
mongoose.connect(mongoDB, { useUnifiedTopology: true,useNewUrlParser: true,useFindAndModify: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to DB...');
});
// ***************************************************************************

app.set("view engine", 'ejs')
app.use (express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'));
app.use(expressSanitazer())
//  RESTFUL ROUTES
app.get("/", function(req, res){
  res.redirect("/blogs")
})

// INDEX ROUTE
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if (err){
      console.log(err)
    } else {
      res.render('index',{blogs:blogs})
    }
  })
})

// NEW ROUTE
app.get("/blogs/new", function(req,res){
  res.render("new")
})

// CREATE ROUTE

app.post("/blogs", function(req,res){
  // clean data from mean users who will try to sabotage your data, not JS is allowed this way, only text
  req.body.blog.body = req.sanitize( req.body.blog.body)
  // create a blog
  Blog.create (req.body.blog, function(err, newBlog){
    if(err){
      res.render("new")
    } else {
      res.redirect("/blogs")
    }
  })
})

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, blog){
    if(err){
      console.log(err)
      res.redirect("/blogs")
    } else {
      res.render("show", {blog: blog})
    }
  })
})

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, blog){
    if(err){
      res.redirect("/blogs")
    } else {
      res.render("edit", {blog:blog})
    }
  })
})

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
  Blog.findByIdAndUpdate(req.params.id,  req.body.blog,  function(err, blog){
    if (err){
      res.redirect("/blogs")
    } else {
      res.redirect ("/blogs/" + req.params.id)
    }
  })
})

//DELETE ROUTE

app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err, blog){
    if (err){
      res.redirect("/blogs")
    } else {
      blog.remove()
      res.redirect("/blogs")
    }
  })
})
const PORT = process.env.PORT || 3000
app.listen(PORT, function(){
  console.log("BlogSite is on")
})