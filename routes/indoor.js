const express = require("express");
const router = express.Router();
const isAuth = require("../utils/filters").isAuth;
const isAdmin = require("../utils/filters").isAdmin;
const personnel = require("../models").Indoor;
const departments = require("../models").Department;
const user = require("../models").User;

router.post('/', isAdmin, (req, res) => {
    console.log(" aaaa ", req.body.department);
    const newPerson = {
        firstName : req.body.fname,
        lastName : req.body.lname,
        birthday : req.body.bdate,
        Role : req.body.role,
        email: req.body.email,
        phone : req.body.phone,
        DepartmentId : req.body.department
    };
    user.create({
        Name: newPerson.firstName + newPerson.lastName,
        Email : newPerson.email,
        Phone : newPerson.phone,
        Title : newPerson.Role,
        Password : "password",
        isAdmin : false
    });

    personnel.create(newPerson).then( result => {
        req.flash("Success", "Added new Person");
        res.redirect("/indoor");
    });
});

router.post('/delete', isAdmin, (req, res)=>{
    personnel.destroy({
        where: {
            id: req.body.personID
        }
    });
    res.redirect('/indoor');
});

router.get('/', isAdmin, (req, res) => {
    departments.findAll().then(
        departments =>{
            console.log(departments);
            res.render('indoor/indoor', {
                title: 'Indoor View',
                user: req.user,
                departments
            });
        }
    );
});

router.get('/show', isAuth, (req, res) => {
    personnel.findAll({include :[  departments ]}).then(
        personnel => {
            res.render('indoor/show', {
                title: "Show All Personnel",
                user : req.user,
                personnel
            });
        }
    ).catch((error) => {
        console.log(error.toString());
        res.status(400).send(error)
    });
})

module.exports = router;
