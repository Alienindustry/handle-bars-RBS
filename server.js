var express = require('express');
var app = express();
var handlebars = require("express-handlebars");

var mongoose = require('mongoose');

var bodyParser = require('body-parser');

var Contact = require(/models/Contact);

app.set('view engine', 'hbs');
app.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs"
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  Contact.find({}).lean()
  .exec((err, contacts) =>{
    if(contacts. length){
      res.render('index', { layout: 'main', contacts: contacts, contactsExist: true}); 
    } else {
        res.render('index', { layout: 'main', contacts: contacts, contractsExist: false }); 
    } 
    })
});

app.post('/addcontact', (req, res) => {
  const { name, email, number } = req.body;
  var contact = new Contact({
    name,
    email,
    number
  });
  contact.save();
  res.redirect('/');
});

app.get('/about', (req, res) => {
  res.render('about', { layout: 'main' });
});
//Mongo is used to connect to our data base 27017 is our port no
mongoose
  .connect('mongodb://localhost:27017/handlebars', {
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

//listening for a request on port 3000
app.listen(3000, () => {
  console.log('server listening on port 3000');
});
