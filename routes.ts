module.exports = function (express) {
    const router = express.Router();
    const { getAllRecipes, getRecipe, addRecipe, deleteRecipe, deleteAll } = require('./controller');

    router.get('/', getAllRecipes);
    router.get('/recipes', getAllRecipes);
    router.get('/recipes/:id', getRecipe);
    router.post('/recipes/add', addRecipe);
    router.delete('/recipes/delete/:id', deleteRecipe);
    router.delete('/recipes/deleteAll', deleteAll);

    return router;
}
