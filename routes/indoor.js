const express = require("express");
const router = express.Router();
const isAuth = require("../utils/filters").isAuth;
const personnel = require("../models").Indoor;
const departments = require("../models").Department;
const models = require("../models")


router.post('/', isAuth, (req, res) => {
    console.log(req.body);
    const newPerson = {
        firstName : req.body.fname,
        lastName : req.body.lname,
        birthday : req.body.bdate,
        Role : req.body.role,
        email: req.body.email,
        department: req.body.department
    };
    personnel.create(newPerson).then( result => {
        req.flash("Success", "Added new Person");
        console.log(newPerson);
        res.redirect("/indoor");
    })
})

router.get('/', isAuth, (req, res) => {
    departments.findAll().then(
        departments =>{
            res.render('indoor', {
                title: 'Indoor View',
                user: req.user,
                departments
            });
        }
    )
})

router.get('/show', isAuth, (req, res) => {
    personnel.findAll({include :[ {models : departments }]}).then(
        personnel =>{
            res.render('show', {
                title: "Show All Personnel",
                user : req.user,
                personnel: personnel,
            });
        }
    ).catch((error) => {
        console.log(error.toString());
        res.status(400).send(error)
    });
})

module.exports = router;
