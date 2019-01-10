const router = require('express').Router();
const session = require('express-session');

const autoCheck = (req, res, next) =>{
    if (!req.user){
        res.redirect('/login/google');

    }   else {
        // if logged in
        next();
    }
}

router.get('/changeinfor',autoCheck, (req, res) =>{
    res.send("you are logged" , + req.user.username);
    res.redirect('/changeinfor');
})

module.exports = router;