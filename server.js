var express = require("express");
var app = express();

var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var handlebars = require("express-handlebars");
var bcrypt = require("bcryptjs");

const Contact = require("./models/Contact");
const user = require("./models/User");

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "hbs");

app.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
  })
);

app.get("/", (req, res) => {
  res.render("login", { layout: "main" });
});

app.get("/dashboard", (req, res) => {
  Contact.find({})
    .lean()
    .exec((err, contacts) => {
      if (contacts.length) {
        res.render("dashboard", {
          layout: "main",
          contacts: contacts,
          contactsExist: true,
        });
      } else {
        res.render("dashboard", {
          layout: "main",
          contacts: contacts,
          contactsExist: false,
        });
      }
    });
});

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
});

app.post("/addContact", (req, res) => {
  const { name, email, number } = req.body;

  let contact = new Contact({
    name,
    email,
    number,
  });

  contact.save();
  res.redirect("/dashboard");
});

//     user.password - await bcrypt.hash(password, salt);

//     await user.save();
//     res.redirect('/');

//   } catch (err) {
//     console.log(err.message)
//     res.status(500).send('server Error')
//   }

// });

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
//Mongo is used to connect to our data base 27017 is our port no
mongoose
  .connect("mongodb+srv://RichardBS:Joshua07@cluster0-3uy5p.mongodb.net/test", {
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

//listening for a request on port 3001
app.listen(3001, () => {
  console.log("server listening on port 3000");
});
