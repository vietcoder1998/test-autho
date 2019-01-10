const express = require('express');
const app = express();
const host = 3000;
const bodyParser = require('body-parser');
const connection = require('./config/database');
const querystring = require('./querrystring/querystring');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const fs = require('fs');
const config = require('./config/keys');
const mongoose = require('mongoose');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');
const routes = require('./routes/profile-routes');


const autoCheck = (req, res, next) => {
    if (!req.user) {
        res.redirect('/login/google');

    } else {
        // if logged in
        next();
    }
}

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: 'concat'
}));
// app.use(session({ secret: 'secret-token', resave: true, cookie: { maxAge: 1000 * 5 * 60 } }));
app.use(bodyParser.urlencoded({ extended: true }));
// to use passport
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

mongoose.connect(config.mongoDB.dbURI, { useNewUrlParser: true }, () => {
    console.log('connect to mongodb')
});

// to parser body
app.use(bodyParser.urlencoded({ extended: false }));

// To user from another web.html
app.use(express.static('./public'));

// var fbOpts = {
//     clientID: '261174651417681',
//     clientSecret: '513242f5b712162431a7f2ba02e165b6',
//     callbackURL: 'https://tradatech.localtunnel.me/api/facebook/callback',
// };

// passport.use(new FacebookStrategy(fbOpts, function (accessToken, refreshToken, profile, done) {
//     console.log(profile);
//     done(200, null);
// }));

// passport.use(new GoogleStrategy(config.google, (accessToken, refreshToken, profile, done) => {
//     console.log('inredirecting');    
//     console.log(accessToken, refreshToken, profile, done);
// }));


app.route('/')
    .get((req, res) => {
        res.redirect('/routes.html');
    })

// app.route('/login/facebook')
//     .get(passport.authenticate('facebook'));


// app.route('/api/facebook/callback')
//     .get(passport.authenticate('facebook'), function (err, profile) {
//         console.log(profile);
//     });

//auth with google
app.route('/login/google')
    .get(passport.authenticate('google', { scope: ['profile'] }, (req, res) => {
    }));

//  callback
app.get('/api/google/callback', (req, res) => {
    res.redirect('/');
})


// app.route('/google/user')
//     .get(passport.authenticate('google'), (req, res) => {
//         res.send(req.user);
//     });

// Method POST
app.post('/register', (req, res) => {
    const user = {
        username: req.body.create_username,
        password: req.body.create_password,
    }
    // const token = jwt.sign({ user }, 'secretkey');
    var tokenSession = req.session;

    res.send(user);
    // tokenSession.tokenSecret = token

});

app.get("/private", (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Welcome to private page');
    } else {
        res.send('you are not login');
    }
});

// Method login
app.route('/login').get((req, res) => {
    res.redirect('/login.html');

    fs.readFile("./json/userDB.json", (err, data) => {
        const db = JSON.parse(data);
        console.log(db);
    });
}).post(passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/loginOK' }));


app.get('/loginOK', (req, res) => {
    res.send("ok");
})

// Check Jwt
app.get('/api/check', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, data) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                text: 'This is protected',
                data
            })
        }
    });

});
function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
    } else {
        console.log(err);
        res.sendStatus(403);
    }
    next();
}

app.post('/changeinfor', (req, res) => {
    const name = {
        nameuser: req.body.displayname
    }

    console.log(name.nameuser);
    res.redirect('/promise');
});

// Start and listen on server
app.listen(host, () => {
    console.log(`server running on ${host}`);
});