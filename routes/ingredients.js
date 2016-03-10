var express = require('express');
var router = express.Router();

router.get('/list', function(req, res) {
 var db = req.db;
 var collection = db.all('SELECT Ingredient.ID, Ingredient.Name, Units.Name as Units, Ingredient.Size, Ingredient.Number FROM Ingredient, Units\
  WHERE Ingredient.Units == Units.ID ORDER BY Ingredient.Name', function(e, results) {
  //console.log(results);
  res.json(results);
 });
});

// delete an ingredient
router.get('/delete/:ID', function(req, res) {
 var db = req.db;
 var collection = db.all('DELETE FROM Ingredient WHERE ID = ?', req.params.ID, function(err, results) {
  //console.log(results);
  res.json(results);
 });
});

router.post('/', function(req, res, next) {
 var db = req.db;
 //console.log(req.body);
 var params = [req.body.Name, req.body.Units]
 if (req.body.Size) {
  params.push(req.body.Size);
 }
 if (req.body.Number) {
  params.push(req.body.Number);
 }
 //console.log(params);
 if (req.body.Name.trim() !== "") {
  db.run("INSERT INTO Ingredient (Name, Units, Size, Number) VALUES (?,?,?,?);", params, function(err) {
   //console.log(err);
   var collection = db.all('SELECT * FROM Units', function(e, results) {
    res.render('ingredients', { title: 'Greedy', menu: 'ingredients', units: results, error: err });
   });
  });
 }
 else {
  var collection = db.all('SELECT * FROM Units ORDER BY ID', function(e, results){
   res.render('ingredients', { title: 'Greedy', menu: 'ingredients', units: results, error: "No values supplied" });
   //res.json(results);
  });
 }
});

/* GET home page. */
router.get('/', function(req, res, next) {
 var db = req.db;
 var collection = db.all('SELECT * FROM Units ORDER BY ID', function(e, results){
  res.render('ingredients', { title: 'Greedy', menu: 'ingredients', units: results });
  //res.json(results);
 });
});

module.exports = router;
