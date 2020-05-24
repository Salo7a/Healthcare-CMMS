const express = require('express');
const router = express.Router();
const {isAdmin} = require('../utils/filters');
const workorder = require('../models').WorkOrder;
const device = require('../models').Device;
const departments = require("../models").Department;
const user = require("../models").User;

router.get('/', function (req, res, next) {
    workOrders.findAll().then(WorkOrder=> {
        res.render('workQueue', {
            title: 'Unfinished Work',
            workOrders: WorkOrder
        });
    })
        .catch((error) => {
            console.log(error.toString());
            res.status(400).send(error)
        });

});
// GET Route to manage any new work queue
// router.get('/add', isAdmin, (req, res) => {
//     res.render('addWorkQueue', {
//         title: 'Add',
//         user: req.user
//     });
// });

module.exports = router;