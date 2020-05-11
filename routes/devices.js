const express = require('express');
const router = express.Router();
const {isAdmin} = require('../utils/filters');
const Device = require('../models').Device;
const Department = require('../models').Department;
const models = require('../models');

// GET Route Handler for main devices page
router.get('/', isAdmin, (req, res, next) => {
    // Get all the devices from database
    Device.findAll({include :[ Department ]})
        .then(Devices => {
            res.render('devices/index', {
                title: 'Devices List',
                devices: Devices,
                user: req.user
            });
        })
        .catch((error) => {
            console.log(error.toString());
            res.status(400).send(error)
        });
});

// GET Route Handler for adding a new Device
router.get('/add', isAdmin, (req, res) => {
    res.render('devices/add', {
        title: 'Add a new device',
        user: req.user
    });
});

// POST Route Handler for adding a new Device
router.post('/add', isAdmin, (req, res) => {
    // Create the new Device
    const newDevice = {
        Name: req.body.name,
        Model: req.body.model,
        Serial: req.body.serial,
        ImportDate: DataTypes.STRING,
        InstallationDate: req.body.installationDate,
        SupplyingCompany: DataTypes.STRING
    };
    Device.create(newDevice).then(result => {
        req.flash("success", "Added Device Successfully");
        res.redirect("/devices");
    });

});

// POST Route Handler for Deleting a Device
router.post('/delete', isAdmin, (req, res) => {
    Device.destroy({
        where: {
            id: req.body.deviceID
        }
    });
    res.redirect("/devices");
});

// POST Route Handler for Deleting All the Devices
router.get('/deleteAll', isAdmin, (req, res) => {
    Device.destroy({
        where: {}
    })
        .then(() => {
            req.flash("success", "Deleted All Devices");
            res.redirect("/devices");
        });
});

module.exports = router;