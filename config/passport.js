var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var db = require("../models");

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
        done(null, user.id);
        console.log("User Id: "+user.id);
    });

  passport.deserializeUser(function(id, done) {
    db.User.findOne({
      where: {
        id: id
      },
    }).then(function(result) {
        done(null, result);
    });
  });

  passport.use('local-signup', new LocalStrategy({
      usernameField: 'username',
      nameField: 'name',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, username, password, done) {
      db.User.findOne({ 
        where : {
          email: username
        }
      }).then(function(user) {
        if (user !==null)
        {
          return done(null, false, req.flash('signupMessage',"That email is already taken"));
        } else
        {
          var newUser={

            email: username,
            name: req.body.name,
            password: password
          };

          db.User.create(newUser).then(function(result){
            newUser.id=result.id;
            return done(null, newUser);
          });
        }
      });
  }));

  //LOCAL SIGNIN
  passport.use('local-login', new LocalStrategy(
    {
        usernameField: 'username', 
        passwordField: 'password',
        passReqToCallback: true 
    },
    function(req, username, password, done) {
      db.User.findOne({
          where: {
              email: username,
              password: password
          }
      }).then(function(result) {
          if (result===null) { 
              return done(null, false);
          }
          return done(null,result)
      });
  }));
}
