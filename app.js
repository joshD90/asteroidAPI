require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const ejs = require('ejs');
const calc = require(__dirname + '/calc.js');
//database and authentication modules
//const myMongoose = require(__dirname + '/mongoose.js');
const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');

const app = express();

let asteroidDetails = {};
let asteroidMoreInfo = [];
let mass;
let kineticEnergy;
let heroshimaBomb;
let numBombs;

console.log(process.env.MY_SECRET);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
//set up express to use session middleware
app.use(session({
  secret: process.env.MY_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {}
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/asteroidUsers');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(__dirname + '/index.html');
  } else {
    res.redirect('/login');
    console.log("not authenticated");
  }

});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
})

app.post('/register', (req, res) => {
  User.register({
    username: req.body.username
  }, req.body.password, (err, user) => {
    if (err) {
      res.redirect('/login')
      console.log(err);
    } else {
      res.redirect('/')
    }
  })
})

app.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureMessage: true
}), function(req, res) {
  console.log('has been redirected');
  res.redirect('/');
})


app.post('/asteroid', (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const distance = req.body.distance;

  const url = `https://ssd-api.jpl.nasa.gov/cad.api?date-min=${startDate}&date-max=${endDate}&dist-max=${distance}`;

  https.get(url, (response) => {
    let asteroidData = "";
    response.on('data', function(data) {
      asteroidData += data;
    })
    response.on('end', () => {
      asteroidDetails = JSON.parse(asteroidData);

      res.redirect('/asteroid');
    })

  })
})

app.get('/asteroid', (req, res) => {
  //asteroidDetails.data.sort((a, b) => (parseFloat(a[4]) - parseFloat(b[4])));
  res.render('asteroid.ejs', {

    asteroidList: asteroidDetails.data,
  })
})

app.post('/rearrange', (req, res) => {
  console.log(asteroidDetails.data);
  switch (req.body.arrangeBySelector) {
    case "distance":
      if (req.body.ascDec === "ascending") {
        console.log("im so triggered");
        asteroidDetails.data.sort((a, b) => (a[4] - b[4]));
        res.redirect('/asteroid');
      } else {
        asteroidDetails.data.sort((a, b) => (b[4] - a[4]));
        res.redirect('/asteroid');
      }
      break;

    case "mass":
      if (req.body.ascDec === "ascending") {
        asteroidDetails.data.sort((a, b) => (a[4] - b[4]));
        res.redirect('/asteroid');
      } else {
        asteroidDetails.data.sort((a, b) => (b[10] - a[10]));
        res.redirect('/asteroid');
      }
      break;

    case "velocity":
      if (req.body.ascDec === "ascending") {
        asteroidDetails.data.sort((a, b) => (parseFloat(a[7].slice(0, a[7].length - 4) - parseFloat(b[7].slice(0, b[7].length - 4)))));
        res.redirect('/asteroid');

      } else {
        asteroidDetails.data.sort((a, b) => (parseFloat(b[7].slice(0, b[7].length - 4) - parseFloat(a[7].slice(0, a[7].length - 4)))));
        res.redirect('/asteroid');
      }
      break;

    default:

  }


})

app.post('/moreInfo', (req, res) => {
  console.log(req.body.asteroidDesignation);
  const result = asteroidDetails.data.find(element => element[0] === req.body.asteroidDesignation);
  asteroidMoreInfo = result;

  res.redirect(`/asteroid/${req.body.asteroidDesignation}`);
})

app.get('/asteroid/:asteroidDesignation', (req, res) => {
  const diameter = calc.findDiameter(asteroidMoreInfo[10]);
  console.log("This asteroid is an estimated " + diameter + " kms wide");

  //convert diameter to cm's as its g / cm
  mass = calc.findMass(diameter);
  //convert velocity from km to m/s
  kineticEnergy = calc.findKe(mass, asteroidMoreInfo[7] * 1000);

  heroshimaBomb = 1.5 * Math.pow(10, 13);

  numBombs = kineticEnergy / heroshimaBomb;

  const numKilotonsTnt = kineticEnergy / (4.184 * Math.pow(10, 12));

  res.render('moreInfo.ejs', {
    asteroidField: asteroidDetails.fields,
    asteroidData: asteroidMoreInfo,
    diameter: diameter,
    mass: mass,
    kineticEnergy: kineticEnergy
  })
})

app.get('/impact', (req, res) => {
  //res.sendFile(__dirname + '/impact.html');
  res.render('impact.ejs', {
    numberOfBombs: numBombs
  });
  console.log(numBombs);
})





app.listen(3000, () => {
  console.log('Server is listening on Port 3000');
});








// designation : 363505
//
// orbit_id : 262
//
// cd calender date: 2022-Jan-01 01:25
//
// dist : 0.157697639972094
//
// distance in KM : 23591567
//
// dist_min : 0.157696898442492
//
// dist_max : 0.157698381502098
//
// v_rel : 12.52 km/s
//
// v_inf : 12.5171811123797
//
// t_sigma_f : < 00:01
//
// h - absolute magnitude: 18.33