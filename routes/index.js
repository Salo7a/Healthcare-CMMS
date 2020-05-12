let express = require('express');
let router = express.Router();
const {isAuth} = require('../utils/filters');
const Device = require('../models').Device;
const isAdmin = require('../utils/filters').isAdmin;

router.get('/', isAuth, function (req, res, next) {
    res.render('index', {
        title: 'Home - Extra Cool CMMS',
        user: req.user
    });
});
router.get('/addtest', function (req, res, next) {
    Device.create({
        Name: "Siemens T7 MRI",
        ModelNumber: "T7",
        SerialNumber: "00001",
        Department: "Imaging",
        InstallationDate: "09/05/2020"
    }).then(device => {
        console.log(device)
    });
    req.flash("success", "Added Device Successfully");
    res.redirect("/");
});
router.get('/readtest', function (req, res, next) {
    Device.findAll().then(devices => {
        console.log(devices)
    });
    req.flash("success", "Logged Devices Successfully");
    res.redirect("/");
});
module.exports = router;
