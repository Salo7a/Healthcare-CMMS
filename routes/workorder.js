const express = require('express');
const router = express.Router();
const {isAdmin} = require('../utils/filters');
const workOrders = require('../models').WorkOrder;
const personnel = require("../models").Indoor;
const departments = require("../models").Department;
const user = require("../models").User;
const device = require('../models').Device;

router.get('/', function (req, res, next) {
    workOrders.findAll().then(WorkOrder=> {
        res.render('workorder', {
            title: 'Work list',
            user: req.user,
            workOrders: WorkOrder
        });
    })
    .catch((error) => {
        console.log(error.toString());
        res.status(400).send(error)
    });

});

router.get('/add', isAdmin, (req, res) => {
    departments.findAll().then(
        departments =>{
            personnel.findAll().then(
                personnel=> {
                    device.findAll().then(
                        device=>{
                            res.render('addWorkOrder', {
                                title: 'Add',
                                user: req.user,
                                departments, personnel, device
                            }
                        )
                    });
                })
    });
});

router.post('/add', isAdmin, (req, res) => {
    const newWork = {
        // engineername: req.body.name,
        name: req.body.task,
        date: req.body.Date,
        DeviceId: req.body.device,
        DepartmentId: req.body.department,
        IndoorId: req.body.engineer

        // task_priority: req.body.priority
    };
    workOrders.create(newWork).then(result => {
        req.flash("success", "Added New Work Order Successfully");
        res.redirect("/");
        console.log(newWork);
        console.log(workOrders);
    });
});

module.exports = router;