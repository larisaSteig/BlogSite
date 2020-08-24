const express    = require ('express')
const bodyParser = require('body-parser')
const mongoose  = require('mongoose')
const blog = require('./models/blog')
const dotenv = require('dotenv').config()

const app        = express()
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

//  RESTFUL ROUTES
app.get("/", function(req, res){
  res.redirect("/blogs")
})

app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if (err){
      console.log(err)
    } else {
      res.render('index',{blogs:blogs})
    }
  })
})
















const PORT = process.env.PORT || 3000
app.listen(PORT, function(){
  console.log("BlogSite is on")
})