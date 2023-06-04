"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleAuth = require('passport-google-oauth20').Strategy;
const db_connect_1 = __importDefault(require("./db_connect"));
module.exports = function (passport) {
    passport.use(new googleAuth({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.SECRET,
        callbackURL: '/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
        };
        try {
            let user = await db_connect_1.default
                .getDb()
                .db()
                .collection('users')
                .findOne({ googleId: profile.id });
            if (user) {
                done(null, user);
            }
            else {
                const result = await db_connect_1.default
                    .getDb()
                    .db()
                    .collection('users')
                    .insertOne(newUser);
                const user = result.ops[0];
                done(null, user);
            }
        }
        catch (err) {
            console.log(err);
        }
    }));
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function (id, done) {
        done(null, { id: id });
    });
};
