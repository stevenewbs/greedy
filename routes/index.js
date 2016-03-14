var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Greedy', menu: 'home' });
});

router.post('/login', function(req, res, next) {
 var db = req.db;
 //console.log(req.body);
 var params = [req.body.Username, req.body.Password]/*
 bcrypt.genSalt(10, function(err, salt) {
  bcrypt.hash(req.body.Password, salt, function(err, hash) {
   console.log(hash);
  });
 });
 */
 console.log(params);
 if (req.body.Username.trim() !== "" && req.body.Password.trim() !== "" ) {
  db.get("SELECT * FROM User WHERE Username = ?", params[0], function(err, row) {
   if (err) {
    res.render('login', {title: 'Greedy', menu: 'home', error: err, Username: req.body.Username });
   }
   else if (row) {
    console.log(row);
    console.log(params[1]);
    bcrypt.compare(params[1], row.Password, function(pwerr, pwres) {
     if (pwerr) {
      res.render('login', {title: 'Greedy', menu: 'home', error: pwerr, Username: req.body.Username });
     }
     else if (pwres) {
      res.cookie('user', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
      res.redirect('/')
     }
     else {
      res.render('login', {title: 'Greedy', menu: 'home', error: "Bad username or password", Username: req.body.Username });
     }
    });
   }
   else {
    res.render('login', {title: 'Greedy', menu: 'home', error: "Bad username or password", Username: req.body.Username });
   }
  });
 }
 else {
  res.render('login', {title: 'Greedy', menu: 'home', error: "Bad username or password", Username: req.body.Username });
 }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Greedy', menu: 'home' });
});

module.exports = router;
