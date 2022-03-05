const express = require('express');
const router = express.Router();
const {isAdmin, isAuth} = require('../utils/filters');
const Device = require('../models').Device;
const Department = require('../models').Department;
const Notification = require('../models').Notification;
const models = require('../models');

// GET Route Handler for main devices page
router.get('/', isAuth, async (req, res, next) => {
    let departments = await Department.findAll()
    // Get all the devices from database
    Device.findAll({include: [Department]})
        .then(Devices => {
            res.render('devices/index', {
                title: 'Devices List',
                devices: Devices,
                departments: departments
            });
        })
        .catch((error) => {
            console.log(error.toString());
            res.status(400).send(error)
        });
});

// GET Route Handler for adding a new Device
router.get('/add', isAdmin, async (req, res, next) => {
    let departments = await Department.findAll()
    res.render('devices/add', {
        title: 'Add a new device',
        departments: departments
    });
});

// POST Route Handler for adding a new Device
router.post('/add', isAdmin, async (req, res, next) => {
    // Create the new Device
    const newDevice = {
        Name: req.body.name,
        Manufacturer: req.body.manufacturer,
        Model: req.body.model,
        Serial: req.body.serial,
        ImportDate: DataTypes.STRING,
        InstallationDate: req.body.installationDate,
        SupplyingCompany: req.body.supplier,
        PPMInterval: req.body.ppmInterval
    };
    Device.create(newDevice).then(result => {
        req.flash("success", "Added Device Successfully");
        res.send({msg: "Added Device Successfully", id: result.id,});
    });

});

// POST Route Handler for Deleting a Device
router.post('/delete', isAdmin, (req, res, next) => {
    Device.destroy({
        where: {
            id: req.body.deviceID
        }
    });
    res.send({msg: "Device Deleted Successfully", id: req.body.deviceID});
});

// POST Route Handler for Deleting All the Devices
router.get('/deleteAll', isAdmin, (req, res, next) => {
    Device.destroy({
        where: {}
    })
        .then(() => {
            req.flash("success", "Deleted All Devices");
            res.redirect("/devices");
        });
});

// POST Route Handler for alerting a Device
router.post('/alert', isAuth, (req, res, next) => {
    Device.findOne({
        where: {id: req.body.deviceID},
        include: [Department]
    })
        .then((device) => {
            req.flash("success", "Alert reported");
            const newNotification = {
                Type: 'Repair',
                DepartmentId: device.DepartmentId,
                DeviceId: device.id,
            };
            Notification.create(newNotification)
                .then(() => {
                    req.app.io.to("Head of Engineering").emit('alert', {
                        text: `A Problem Has Been Reported For
                    ${device.Name} #${device.id} in ${device.Department.Name} Department By ${req.user.Name}`
                    });
                    res.redirect("/devices");
                });
        });
});

module.exports = router;
