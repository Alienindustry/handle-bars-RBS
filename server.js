var express = require("express");
var app = express();
var handlebars = require("express-handlebars");

var mongoose = require("mongoose");

var bodyParser = require("body-parser");
var bcrypt = require('bcryptjs');
var Contact = require("./models/Contact");
var user = require("./models/User");

app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs"
  }))

  app.use(express.static('public'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req, res) =>{
    res.render('login', { layout: 'main' });


})


app.get('/dashboard', (req, res) => {
  Contact.find({})
    .lean()
    .exec((err, contacts) => {
      if (contacts.length) {
        res.render("dashboard", {layout: "main",contacts: contacts contactsExist: true
      
      } else {
           res.render('dashboard',{ layout:'main', contacts: contacts, contactsExist: false })
      }
    })
    
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try{
    let user = await user.findOne({ username });

    if(user) {
       res.redirect('/');
       return console.log('User Already Exists');
       
    }
     user = new User({
      username,
      password
    });

    const salt = await bcrypt.genSalt(10);

    user.password - await bcrypt.hash(password, salt);

    await user.save();
    res.redirect('/');

  } catch (err) {
    console.log(err.message)
    res.status(500).send('server Error')
  }
 
  
});


app.post("/addcontact", (req, res) => {
  const { name, email, number } = req.body;
  var contact = new Contact({
    name,
    email,
    number
  });
  contact.save();
  res.redirect("/");
});



app.get("/about", (req, res) => {
  res.render("about", { layout: "main" });
});
//Mongo is used to connect to our data base 27017 is our port no
mongoose
  .connect("mongodb+srv://RichardBS:Joshua07@cluster0-3uy5p.mongodb.net/test", {
    //These are used so we do not get depreciation messages
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    //Console logging to say we are conncted to our DB
    console.log("connected to the DB");
  })

  // .catch to catch and stop the process if there has been an error
  .catch(err => {
    console.log("Not connected to the DB with err : " + err);
  });

//listening for a request on port 3001
app.listen(3001, () => {
  console.log("server listening on port 3000");
});
