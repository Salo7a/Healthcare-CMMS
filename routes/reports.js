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

// GET Route Handler for create report page
router.get('/createReport', isAuth, (req, res, next) => {
    res.render('reports/createReport', {
        title: 'Reports Extraction'
    });
});

module.exports = router;