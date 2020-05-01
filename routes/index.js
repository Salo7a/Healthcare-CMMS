let express = require('express');
let router = express.Router();
const {isAuth} = require('../utils/filters');
router.get('/', isAuth, function (req, res, next) {

    res.render('index', {
        title: 'Home - Extra Cool CMMS',
        user: req.user
    });
});

module.exports = router;
