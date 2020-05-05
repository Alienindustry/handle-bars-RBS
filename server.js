var express = require('express');
var app = express();

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var handlebars = require('express-handlebars');
var bcrypt = require('bcryptjs');
const  passport = require('passport');
const session = require('express-session');


const port = 
const mongourl = process.env.mongourl ||'mongo'
const { isauth } = require('./middleware/iauth');
require('./middleware/passport')(passport);

const Contact = require('./models/Contact');
const user = require('./models/User');

app.use(express.static('public'));

app.use(
  session({
     secret: 'secret',
     resave: true,
     saveUninitialized: true,
     cookie: { maxAge: 60000}

    })
);
app.use(passport.initialize());
app.use(passport.session());



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'hbs');

app.engine( 'hbs', handlebars({
  layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
  }))


app.get('/', (req, res) => {
  try{
  res.render('login', { layout: "main" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error')
  }

})

app.get('/dashboard', isAuth, (req, res) => {
  try {
  Contact.find({user: req.user.id})
    .lean()
    .exec((err, contacts) => {
      if (contacts.length) res.render('dashboard', { layout: 'main', contacts: contacts, contactsExist: true, username: req.user.username });
        
       else { res.render('dashboard', { layout: 'main', contacts: contacts, contactsExist: false,});
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error')
  }
});

app.get('/signout', (req, res) => {

  req.logout();
  res.redirect('/');
})

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).render("login", { layout: "main", userExist: true });
    }
    user = new user({
      username,
      password,
    });

    // salt Generation//
    const salt = await bcrypt.genSalt(10);
    //Password Encryption using password and salt//
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(200).render("login", { layout: "Main", userDoesNotExist: true });
    } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
})

app.post('/signin', ( req, res, next) => {
    try{
      passport.authenticate('Local', {
          successRedirect: '/dashboard',
          failureRedirect: '/?incorrectlogin'
          })(req, res, next);

    } catch (err){
         console.log(err.message)
         res.status(500).send('Server Error')
    }
})

app.get('/signout', (req, res)=>{
    rec.logout();
    res.redirect('/');
})


app.post("/addContact", (req, res) => {
  const { name, email, number } = req.body;
 try{
    let contact = new Contact({
    user: req.user.id,    
    name,
    email,
    number,
  });

  contact.save()
  res.redirect('/dashboard?contactSaved');
 } catch(err) {
    console.log(err.message);
    res.status(500).send('server Error')
   }

  

// app.post("/addcontact", (req, res) => {
//   const { name, email, number } = req.body;
//   var contact = new Contact({
//     name,
//     email,
//     number
//   });
//   contact.save();
//   res.redirect("/");
// });

// app.get("/about", (req, res) => {
//   res.render("about", { layout: "main" });
// });

// Mongo is used to connect to our data base 27017 is our port no
  })
mongoose.connect(, {
    //These are used so we do not get depreciation messages
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    //Console logging to say we are conncted to our DB
    console.log("connected to the DB");
  })

  // .catch to catch and stop the process if there has been an error
  .catch((err) => {
    console.log("Not connected to the DB with err : " + err);
  });

//listening for a request on port 3000
app.listen(3000, () => {
  console.log("server listening on port $ {port"});

});
