const sequelize = require('sequelize');
const {Op} = require('sequelize');
let express = require('express');
let router = express.Router();
const {isAuth} = require('../utils/filters');
const User = require('../models').User;
const Device = require('../models').Device;
const Department = require('../models').Department;
const WorkOrder = require("../models").WorkOrder;
const Inventory = require("../models").Parts;
const isAdmin = require('../utils/filters').isAdmin;

router.get('/', isAuth, function (req, res, next) {
    User.count().then(users => {
        Device.count().then(devices => {
            Department.count().then(departments => {
                WorkOrder.count().then(orders => {
                    Inventory.count().then(inv => {
                        Device.findAll({
                            include: [Department],
                            attributes: ['Department.Name', 'DepartmentId', [sequelize.fn('count', sequelize.col('DepartmentId')), 'count']],
                            group: ['DepartmentId'],
                            raw: true,
                            order: sequelize.literal('count DESC')
                        }).then(DepDev => {
                            // console.log("DepDev");
                            // console.log(DepDev);
                            WorkOrder.findAll({
                                include: [Department],
                                where: {type: 'Repair'},
                                attributes: ['Department.Name', 'DepartmentId', [sequelize.fn('count', sequelize.col('DepartmentId')), 'count']],
                                group: ['DepartmentId'],
                                raw: true,
                                order: sequelize.literal('count DESC')
                            }).then(DepAlert => {
                                WorkOrder.findAll({
                                    where: {type: {[Op.ne]: 'Daily'}},
                                    attributes: ['Date', [sequelize.fn('count', sequelize.col('type')), 'count']],
                                    group: ['Date'],
                                    raw: true,
                                }).then(DepTime => {
                                    // console.log("DepTime");
                                    // console.log(DepTime);
                                    res.render('index', {
                                        title: 'Home - Extra Cool CMMS',
                                        users, devices, departments, orders, DepDev, DepAlert, DepTime, inv
                                    });
                                })
                            })
                        })
                    })
                })
            })
        })
    });


});


router.get('/addtest', async function (req, res, next) {
    await User.findOrCreate({
        where: {
            Name: "John Doe",
            Phone: "01123456789",
            Email: "admin@clinical.com",
            Title: "Head of Engineering",
            Password: "password",
            isAdmin: true,
            DepartmentId: 1
        }
    });
    await User.findOrCreate({
        where: {
            Name: "Jane Doe",
            Phone: "01123456789",
            Email: "technician@clinical.com",
            Title: "MRI Technician",
            Password: "password",
            isAdmin: false,
            DepartmentId: 1
        }
    });
    req.flash("success", "Added Users Successfully");
    res.redirect("/");
});
router.get('/readtest', function (req, res, next) {
    Device.findAll().then(devices => {
        console.log(devices)
    });
    req.flash("success", "Logged Devices Successfully");
    res.redirect("/");
});
router.get("/livetest", (req, res, next) => {
    req.app.io.to("Head of Engineering").emit('alert', {text: "Test!!"});
    res.send({msg: "ok"})
})
module.exports = router;
