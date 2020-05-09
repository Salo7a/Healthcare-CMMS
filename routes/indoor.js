const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const isAuth = require("../utils/filters").isAuth;

router.get('/', isAuth, (req, res) => {
    res.render("../views/indoor.ejs")
});

module.exports = router;
