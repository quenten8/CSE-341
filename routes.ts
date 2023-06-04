module.exports = function (express) {
    const router = express.Router();
    const passport = require('passport')
    const {ensureAuth, ensureGuest} = require('./authController')

    const { getAllRecipes, getRecipe, changeRecipe, addRecipe, deleteRecipe, deleteAll } = require('./recipeController');
    //Recipe routes
    router.get('/recipes', getAllRecipes);
    router.put('/recipes/change/:id', changeRecipe);
    router.post('/recipes/add', addRecipe);
    router.delete('/recipes/delete/:id', deleteRecipe);
    router.delete('/recipes/deleteAll', deleteAll);
    router.get('/recipes/:id', getRecipe);    

    router.use((req, res, next) => {
        console.log(`Received ${req.method} request to ${req.url}`);
        next();
      });
      

    //Authentication routes
        router.get('/', ensureGuest, (req, res) => {
            res.sendFile('./frontend/index.html', { root: __dirname });
        });
        //Authenticate with google
        router.get('/google',passport.authenticate('google', {scope: ['profile']}))

        //Callback route
        router.get('/auth/google/callback',passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
            res.redirect('/dashboard')
        })
        //Logout
        router.get('/logout', (req, res) => {
            req.logout(() => {
                res.redirect('https://accounts.google.com/Logout');
            });
            res.redirect('/')
        });
        
    //User dashboard
    router.get('/dashboard', ensureAuth, (req, res) => {
        res.sendFile('./frontend/dashboard.html', { root: __dirname });
    }); 

    return router;
}
