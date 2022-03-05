const express = require('express');
const router = express.Router();
const {isAdmin, isAuth} = require('../utils/filters');
const Department = require('../models').Department;

// GET Route Handler for main devices page
router.get('/', isAuth, (req, res, next) => {
    // Get all the devices from database
    Department.findAll()
        .then(Departments => {
            res.render('departments/index', {
                title: 'Departments List',
                departments: Departments
            });
        })
        .catch((error) => {
            console.log(error.toString());
            res.status(400).send(error)
        });
});

// GET Route Handler for adding a new Department
router.get('/add', isAdmin, (req, res) => {
    res.render('departments/add', {
        title: 'Add a new department'
    });
});

// POST Route Handler for adding a new Department
router.post('/add', isAdmin, (req, res) => {
    // Create the new Device
    const newDepartment = {
        Name: req.body.name,
    };
    
    Department.create(newDepartment).then(result => {
        res.send({id: result.id, Name: req.body.name, msg: "Department created successfully."});
    });
    
});

// POST Route Handler for Deleting a Department
router.post('/delete', isAdmin, (req, res) => {
    Department.destroy({
        where: {
            id: req.body.departmentID
        }
    });
    res.send({id: req.body.departmentID, msg: "Department deleted successfully."});
});

// POST Route Handler for Deleting All the Departments
router.get('/deleteAll', isAdmin, (req, res) => {
    Department.destroy({
        where: {}
    })
        .then(() => {
            req.flash("success", "Deleted All Departments");
            res.redirect("/devices");
        });
});

module.exports = router;