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
        title: 'Reports'
    });
});

// GET Route Handler for repair report page
router.get('/repair', isAuth, (req, res, next) => {
    res.render('reports/repair', {
        title: 'Repair Report'
    });
});

// GET Route Handler for ppm report page
router.get('/ppm', isAuth, (req, res, next) => {
    res.render('reports/ppm', {
        title: 'PPM Report'
    });
});

// GET Route Handler for daily inspection report page
router.get('/daily', isAuth, (req, res, next) => {
    res.render('reports/daily', {
        title: 'Daily Inspection Report'
    })
});

// GET Route Handler for adding a new Device
router.post('/add', isAuth, (req, res) => {
    res.render('reports/add', {
        title: 'Get The Report'
    });
});


module.exports = router;