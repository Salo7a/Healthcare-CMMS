const express = require('express');
const router = express.Router();
const {isAdmin} = require('../utils/filters');
const isAuth = require('../utils/filters').isAuth;
const workOrders = require('../models').WorkOrder;
const personnel = require("../models").Indoor;
const departments = require("../models").Department;
const user = require("../models").User;
const device = require('../models').Device;
const notification = require('../models').Notification;

router.get('/', function (req, res, next) {
    workOrders.findAll({include: [departments, device, user]}).then(WorkOrder => {
        res.render('workorder/workorder', {
            title: 'Work list',
            workOrders: WorkOrder
        });
        console.log("ahii",workOrders);
    })
    .catch((error) => {
        console.log(error.toString());
        res.status(400).send(error)
    });
});

router.get('/add', isAdmin, (req, res) => {
    departments.findAll().then( departments =>{
        personnel.findAll().then(personnel=> {
            device.findAll().then(device=>{
                res.render('workorder/addWorkOrder', {
                    title: 'New Work Order',
                    departments,
                    personnel,
                    device
                });
            });
        });
    });
});

router.post('/order', isAuth, (req, res) =>{
    console.log("body", req.body);
    notification.findOne({
        include: [device, departments],
        where: {id : req.body.notificationID}
    }).then(
        notification => {
            device.findAll({
                where: { DepartmentId : req.user.DepartmentId}
            }).then( devices => {
                console.log("NOT", notification);
                res.render("workorder/order", {
                    title: notification.Type,
                    notification,
                    devices
                })
            });
        }
    ).catch((error) => {
        console.log(error.toString());
        res.status(400).send(error)
    });
});

router.post('/add', isAuth, (req, res) => {
    console.log(req.body.type);
    if (req.body.type === 'Daily') {
        workOrders.findOne({
            where:{
                Date: new Date(),
                Type: "Daily"
            }
        }).then(order=>{
            let daily = order.daily
            let devs = Object.keys(daily) ;
            let target = ["removed", "cracks", "broken", "damage", "spare", "broken_cable", "damage_cable",
                "spare_cable" , "other"];
            let keys = Object.keys(req.body) ;
            console.log(daily);

            keys.forEach(key =>{
                if(target.includes(key)){
                    let checked = req.body[key];
                    devs.forEach(dev => {
                        if(checked.includes(dev)){
                            daily[dev][key] = "Checked";
                        }
                    })
                }
            })
            order.daily = daily
            order.save()
            req.flash("success", "Added New Work Order Successfully");
            res.redirect("/");
        });
    } else {
        const newWork = {
            DepartmentId: req.user.DepartmentId,
            UserId: req.user.id,
            type: req.body.type,
            DeviceId: req.body.deviceId,
            alert: JSON.stringify({
                description: req.body.description,
                action: req.body.action
            }),

            ppm:
                JSON.stringify({
                clean_dust: req.body.clean_dust,
                clean_surface: req.body.clean_surface,
                lubricated: req.body.lubricated,
                calibrated: req.body.calibrated,
                desc_replaced: req.body.desc_replaced,
                desc_adjustments: req.body.desc_adjustments,
                comments: req.body.comments
            }),

            daily: JSON.stringify({
                foreign: req.body.removed,
                cracks: req.body.cracks,
                broken_bat: req.body.broken,
                damage_bat: req.body.damage,
                spare_bat: req.body.spare,
                broken_cable: req.body.broken_cable,
                damage_cable: req.body.damage_cable,
                spare_cable: req.body.spare_cable,
                other: req.body.other
            })
        };
        workOrders.create(newWork).then(result => {
            req.flash("success", "Added New Work Order Successfully");
            res.redirect("/");
        });
    }
});

module.exports = router;