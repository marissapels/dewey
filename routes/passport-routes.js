// app/routes.js
module.exports = function(app, passport) {

    //--------------------Signup Page---------------------------------
    app.get('/', function(req, res) {
        res.render('home.ejs'); // load the index.ejs file
    });

    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs');
    });
    // process the signup form
    app.post('/api/users', passport.authenticate('local-signup', {
        successRedirect : '/login', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

   //---------------------Login Page-------------------------------
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs');
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/library', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

//-------------------All other Page routes------------------------------
//User must be logged in to access these routes
    app.get('/library', isLoggedIn, function(req, res) {
        res.render('library.ejs', {
            user : req.user // get the user out of session and pass to template

        });
        console.log(req.user);
    });
    app.get('/library/api', isLoggedIn);
    app.get('/groups', isLoggedIn, function(req, res) {
        res.render('groups.ejs', {
            user: req.user
        });
    });
    app.get('/discussions', isLoggedIn, function(req, res) {
        res.render('discussions.ejs', {
            user: req.user
        });
    })
    app.get('/discover', isLoggedIn, function(req, res) {
        res.render('discover.ejs');
    });

//----------------------Log Out----------------------------------------
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}