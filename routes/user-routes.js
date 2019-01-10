//will contain all of my user related routes

const express = require('express');
const router = express.Router();
const queryString = require('../querrystring/querystring');
const connection = require('../config/database');

// Redirect to login
// router.get('/login', (req, res) => {
//     res.redirect('/login.html');
// });

router.get('/register', (req, res) => {
    res.redirect('/register.html');
});

// Test Router
router.get('/message', (req, res) => {
    res.json('11111');
    console.log(queryString.querry1);
});

// Querry all infor of user
router.get('/user', (req, res) => {

    connection.query(queryString.query1, (err, rows, fields) => {
        if (err) {
            console.log(err);
        }
        res.json(rows);
    });

});
router.get('/home', (req, res) => {
    res.redirect('/home.html');
});

// get user ID
router.get('/user/:id', (req, res) => {

    const userID = req.params.id;
    connection.query(queryString.query1, [userID], (err, rows, fields) => {
        // If error
        if (err) {
            res.sendStatus(500);
            console.log("Fail to connect to user:" + err);
            res.end();
        }

        // json return 
        console.log("i think we connect to database");

        // Mapping to database component
        const user = rows.map((rows) => {
            return { firstname: rows.username };
        });

        res.json(user);
    });
});


router.get('/student', (req, res) => {
    res.redirect('student.html');
});
// Pool connection

router.get('/googleSignin', (req, res) => {
    res.redirect('test.html');
})

router.get('/routes', (req, res) => {
    res.redirect('routes.html');
})

router.get('/loginOK', (req, res ) =>{
    res.send("success");
})

router.get('/promise', (req,res) => {
    res.redirect('./promise.html');
});

module.exports = router;
