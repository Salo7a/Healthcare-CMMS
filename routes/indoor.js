const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const isAuth = require("../utils/filters").isAuth;
const personnel = require("../models").Indoor;



router.post('/', isAuth, (res, req)=>{
    console.log(req.body);
    const newPerson = {
        firstName : req.body.fname,
        lastName : req.body.lname,
        birthday : req.body.bdate,
        Role : req.body.role
    };
    personnel.create(newPerson).then( result => {
        req.flash("Success", "Added new Person");
        console.log(newPerson);
        req.redirect("/indoor");
    })
})

router.get('/', isAuth, (req, res) => {
    res.render('indoor', {
        title: 'Indoor View',
        user: req.user
    });
    console.log("This ", personnel);
})

router.get('/show', isAuth, (req, res) => {
    personnel.findAll().then(
        personnel =>{
            res.render('show', {
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
