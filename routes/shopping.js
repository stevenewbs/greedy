var express = require('express');
var router = express.Router();

// get the list of ingredients in a recipe
router.get('/adding/:ID', function(req, res) {
 var db = req.db;
 var collection = db.all('SELECT RecipeMap.IngredientID as ID, RecipeMap.Amount, Ingredient.Name, Units.Name as Units FROM RecipeMap, Ingredient, Units \
  WHERE RecipeID = ? AND Ingredient.ID = RecipeMap.IngredientID AND Ingredient.Units = Units.ID ORDER BY Ingredient.Name ', req.params.ID, function(err2, results) {
   //console.log(results);
  res.json(results);
 });
});

/* GET home page. */
router.get('/', function(req, res, next) {
 var db = req.db;
 var collection = db.all('SELECT * FROM Recipe ORDER BY Recipe.Name', function(e, results){
  res.render('shopping', { title: 'Greedy', menu: 'list', recipes: results });
 });
});

module.exports = router;
