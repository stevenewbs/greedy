var express = require('express');
var router = express.Router();

router.get('/list', function(req, res) {
 var db = req.db;
 var collection = db.all('SELECT Recipe.ID, Recipe.Name, Recipe.Description, \
 (SELECT COUNT(*) FROM RecipeMap WHERE RecipeID = Recipe.ID) as NumIngredients FROM Recipe ORDER BY Recipe.Name', function(e, results){
  res.json(results);
 });
});

// delete an recipe
router.get('/delete/:ID', function(req, res) {
 var db = req.db;
 var collection = db.all('DELETE FROM Recipe WHERE ID = ?', req.params.ID, function(err, results) {
  //console.log(results);
  res.json(results);
 });
});

// get the list of ingredients in a recipe
router.get('/ingredients/list/:ID', function(req, res) {
 var db = req.db;
 var collection = db.all('SELECT RecipeMap.LinkID as ID, RecipeMap.IngredientID, RecipeMap.Amount, Ingredient.Name, Units.Name as Units FROM RecipeMap, Ingredient, Units \
  WHERE RecipeID = ? AND Ingredient.ID = RecipeMap.IngredientID AND Ingredient.Units = Units.ID ORDER BY Ingredient.Name', req.params.ID, function(err2, results) {
   //console.log(results);
  res.json(results);
 });
});

// delete an ingredient from the map
router.get('/ingredients/delete/:ID', function(req, res) {
 var db = req.db;
 var collection = db.all('DELETE FROM RecipeMap WHERE LinkID = ?', req.params.ID, function(err, results) {
  //console.log(results);
  res.json(results);
 });
});

router.post('/manage/:ID', function(req, res, next) {
 var db = req.db;
 //console.log(req.body);
 var params = [req.params.ID, req.body.Ingredient, req.body.Amount]
 //console.log(params);
 db.run("INSERT INTO RecipeMap (RecipeID, IngredientID, Amount) VALUES (?,?,?);", params, function(err) {
  //console.log(err);
  if (err) {
   res.render('recipesManage', { title: 'Greedy', menu: 'recipes', error: err2 });
  }
  else {
   res.redirect('/recipes/manage/' + req.params.ID);
  }
 });
});

router.get('/manage/:ID', function(req, res) {
 var db = req.db;
 db.get('SELECT Recipe.Name from Recipe WHERE ID = ? ORDER BY Recipe.Name', req.params.ID, function(err1, reciperow) {
  if (err1) {
   res.render('recipesManage', {title: 'Greedy', menu: 'recipes', error: err1 });
  }
  else {
   var collection = db.all('SELECT Ingredient.ID, Ingredient.Name, Units.Name as Units, Ingredient.Size, Ingredient.Number \
   FROM Ingredient, Units WHERE Ingredient.Units == Units.ID ORDER BY Ingredient.Name', function(err2, results) {
    //console.log(results);
    //console.log(err2)
    if (err2) {
     res.render('recipesManage', { title: 'Greedy', menu: 'recipes', recipe: reciperow.Name, error: err2 });
    }
    else {
     res.render('recipesManage', { title: 'Greedy', menu: 'recipes', recipe: reciperow.Name, ingredients: results });
    }
   });
  }
 });
});

router.post('/', function(req, res, next) {
 var db = req.db;
 //console.log(req.body);
 var params = [req.body.Name]
 if (req.body.Description) {
  params.push(req.body.Description);
 }
 //console.log(params);
 if (req.body.Name.trim() !== "") {
  db.run("INSERT INTO Recipe (Name, Description) VALUES (?,?);", params, function(err) {
   //console.log(err);
   res.render('recipes', { title: 'Greedy', menu: 'recipes', error: err });
  });
 }
 else {
  res.render('recipes', { title: 'Greedy', menu: 'recipes', error: "No values supplied" });
 }
});

/* GET home page. */
router.get('/', function(req, res, next) {
 res.render('recipes', { title: 'Greedy', menu: 'recipes' });
});

module.exports = router;
