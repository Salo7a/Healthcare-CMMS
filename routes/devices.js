const express = require('express');
const router = express.Router();
const {isAdmin} = require('../utils/filters');
const Device = require('../models').devices;

router.get('/', isAdmin, (req, res, next) =>
{
    // Get all the devices from database
    const devicesList = Device.findAll()
        .then(Device => res.status(200).send(Device))
        .catch((error) => {
            console.log(error.toString());
            res.status(400).send(error)
        });
    
    console.log(devicesList);
    
    // res.render('devices', {
    //     title: 'Devices List',
    //     devices: devicesList,
    //     user: req.user
    // });
});

router.get('/add', isAdmin, (req, res) => {
    res.render('addDevice', {
        title: 'Add a new device',
        user: req.user
    });
});

router.post('/add', isAdmin, (req, res) => {
    // Create the new Device
    const newDevice = {
        Name: req.body.name,
        ModelNumber: req.body.modelNumber,
        SerialNumber: req.body.serialNumber,
        Department: req.body.department,
        InstallationDate: req.body.installationDate
    };
    
    Device.create(newDevice);
    res.render('devices', {
        title: 'Devices List',
        devices: newDevice,
        user: req.user
    });
});

module.exports = router;