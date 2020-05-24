const express = require('express');
const router = express.Router();
const {isAdmin, isAuth} = require('../utils/filters');
const Device = require('../models').Device;
const Department = require('../models').Department;
const Notification = require('../models').Notification;
const models = require('../models');

// GET Route Handler for main reports page
router.get('/', isAuth, (req, res, next) => {
    res.render('reports/index', {
        title: 'Reports',
        user: req.user
    });
});

// GET Route Handler for create report page
router.get('/createReport', isAuth, (req, res, next) => {
    Device.findAll({
        include :[ Department ]
    })
        .then(Devices => {
            res.render('reports/createReport', {
                title: 'Reports Extraction',
                user: req.user,
                devices: Devices
            });
        });
});

module.exports = router;