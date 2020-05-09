const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const isAuth = require("../utils/filters").isAuth;

router.get('/', isAuth, (req, res) => {
    res.render('indoor', {
        title: 'Indoor View',
        user: req.user
    });
});
router.get('/show', isAuth, (req, res) =>{
    res.render('show', {
        title: "Show All Personnel",
        user : req.user
    })
})
module.exports = router;
