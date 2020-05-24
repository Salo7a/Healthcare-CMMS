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


router.post("/report", isAuth, (req, res)=>{
    console.log("The Type is ", req.body.reportsMenu);
    models.WorkOrder.findAll({
        include: [Device, Department],
        where: {type : req.body.reportsMenu}
    }).then( report => {
        console.log(report);
        res.render('reports/report', {
            title: req.body.type +" Detailed Report",
            user: req.user,
            report
        });
    });
});

module.exports = router;