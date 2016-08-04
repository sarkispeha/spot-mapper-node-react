import passport from 'passport';
import request from 'request';
import {Strategy as LocalStrategy} from 'passport-local';

const User = require('../models/user');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
	User.findOne({ email: email.toLowerCase() }, (err, user) => {
		if (!user) {
			return done(null, false, { msg: `Email ${email} not found.` });
		}
		user.comparePassword(password, (err, isMatch) => {
			if (isMatch) {
				return done(null, user);
			}
			return done(null, false, { msg: 'Invalid email or password.' });
		});
	});
}));
