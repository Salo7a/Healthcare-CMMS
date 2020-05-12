const express = require("express");
const router = express.Router();
const isAuth = require("../utils/filters").isAuth;
const isAdmin = require("../utils/filters").isAdmin;
const devices = require('../models').Device;
const Department = require('../models').Department;
const parts = require("../models").Parts;
const user = require("../models").User;

// GET Route Handler for main parts page 
router.get('/', isAuth, (req, res) => {
    parts.findAll({ include: [devices] }).then(
        parts => {
            res.render('parts/index', {
                title: 'Parts List',
                user: req.user,
                parts
            }).catch((error) => {
                console.log(error.toString());
                res.status(400).send(error);
            });
        });
});
// GET Route Handler for adding a part
router.get('/add', isAdmin, (req, res) => {
    devices.findAll({ include: [Department] }).then(
        devices => {
            console.log(devices);
            res.render('parts/add', {
                title: 'Add a new part',
                user: req.user,
                devices
            });
        });
});

// POST Route Handler for adding a part
router.post('/add', isAdmin, (req, res) => {
    const newPart = {
        Type: req.body.type,
        Model: req.body.model,
        Quantity: req.body.quantity,
        Price: req.body.price,
        InstallationDate: req.body.installationDate,
        DeviceId: req.body.device
    };
    parts.create(newPart).then(result => {
        req.flash("success", "Added Part Successfully");
        res.redirect("/parts");
    });
});
//POST Route Handler for deleting a part
router.post('/delete', isAdmin, (req, res) => {
    parts.destroy({
        where: { id: req.body.partID }
    });
    res.redirect('/parts');
});

//POST Route Handler for Deleting all part
router.get('deleteAll', isAdmin, (req, res) => {
    parts.destroy({
        where: {}
    }).then(() => {
        req.flash("Success", "Deleted All Parts");
        res.redirect('/parts');
    });
});

module.exports = router;