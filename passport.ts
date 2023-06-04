const googleAuth = require('passport-google-oauth20').Strategy;
import dbConnect from './db_connect';

module.exports = function (passport) {
  passport.use(
    new googleAuth(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        };
        try {
          let user = await dbConnect
            .getDb()
            .db()
            .collection('users')
            .findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            const result = await dbConnect
            .getDb()
            .db()
            .collection('users')
            .insertOne(newUser);
          const user = result.ops[0];
          done(null, user);          
          }
        } catch (err) {
          console.log(err);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });
  

  passport.deserializeUser(function (id, done) {
    done(null, { id: id });
  });
};
