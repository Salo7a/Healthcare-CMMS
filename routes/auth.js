const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models').User;
const Device = require('../models').Device;
const Department = require('../models').Department;
const Persons = require("../models").Indoor;
const Parts = require("../models").Parts;

const { NotAuth, isAuth } = require('../utils/filters');
const { check, validationResult, body } = require('express-validator');
const { GenerateDates, GenerateOrders, AddTestData, GenerateQueue } = require('../utils/GenerateData');
const { Op } = require('sequelize');
const Chance = require('chance');
// const loadCSVData = require('../utils/loadCSV');
const fs = require('fs');
const neatCsv = require('neat-csv');
require('dotenv').config();
let chance = new Chance();

function issueToken(user, done) {
    let chance = new Chance();
    let token = chance.word({ length: 60 });
    user.update({
        RememberHash: token
    }).then(result => {
        return done(null, token);
    }).catch(err => {
        return done(err);
    })
}

router.get('/login', NotAuth, function (req, res, next) {
    res.render('login', {
        title: 'Login'
    });
});
router.get('/test', NotAuth, function (req, res, next) {
    try {
        GenerateDates();
        GenerateOrders();
        req.flash("success", "Data Generated Successfully");
    } catch (e) {
        req.flash("error", "An error occurred while generating data");
        console.log(e);
    }

    res.redirect('/auth/login');
});
router.post('/login', NotAuth, passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: true
}), function (req, res, next) {
    req.flash('success', 'You\'ve Logged In Successfully');
    if (!req.body.remember_me) {
        return next();
    }

    issueToken(req.user, function (err, token) {
        if (err) {
            return next(err);
        }
        res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
        return next();
    });
},
    function (req, res) {
        res.redirect('/');
    });

router.get('/addtest', function (req, res, next) {
    User.create({
        Name: "John Doe",
        Email: "admin@clinical.com",
        Phone: "01123456789",
        Title: "Head of Engineering",
        Password: "password",
        isAdmin: true,
        DepartmentId: 1
    });
    User.create({
        Name: "Jane Doe",
        Email: "technician@clinical.com",
        Phone: "01123456789",
        Title: "MRI Technician",
        Password: "password",
        isAdmin: false,
        DepartmentId: 1
    });

    const departmentsList = [{ "Cardiac Catheterization": 1 }, { "Surgery Care": 2 }, { "Cardiology": 3 }, { "Emergency": 4 }]
    for (let i = 0; i < departmentsList.length; i++) {
        Department.create({
            Name: Object.keys(departmentsList[i])[0]
        });
    }

    fs.readFile('routes/DevicesData.csv', async (err, data) => {
        if (err) {
            console.log('errorrrr');
            console.error(err);
            return
        }

        let devicesList;
        devicesList = await neatCsv(data);
        console.log(devicesList[0]);
        for (let i = 0; i < devicesList.length; i++) {
            // Return the id of the department
            const currentDepartment = departmentsList.filter(dep => dep[devicesList[i].Department]);
            const currentDepID = currentDepartment[0][devicesList[i].Department];
            Device.create({
                Name: devicesList[i].Name,
                Model: devicesList[i].Model,
                Serial: devicesList[i].Serial,
                ImportDate: devicesList[i].ImportDate,
                InstallationDate: devicesList[i].InstallationDate,
                ScrappingDate: devicesList[i].ScrappingDate,
                SupplyingCompany: devicesList[i].SupplyingCompany,
                PPMInterval: devicesList[i].PPMInterval,
                DepartmentId: currentDepID
            });
        }
        console.log('Created!')
    });

    fs.readFile("routes/indoor.csv", async (err, data) => {
        if (err) {
            console.log(err);
        }
        let indoor;
        indoor = await neatCsv(data);
        console.log(indoor);
        indoor.forEach(person => {
            Persons.create({
                firstName: person.firstName,
                lastName: person.lastName,
                birthday: person.birthday,
                email: person.email,
                Role: person.Role,
                phone: person.phone,
                DepartmentId: person.DepartmentId
            });
            User.create({
                Name: person.firstName + " " + person.lastName,
                Email: person.email,
                birthday: person.birthday,
                Phone: person.phone,
                Title: person.Role,
                Password: "password",
                isAdmin: false,
                DepartmentId: person.DepartmentId
            })
        });
    });
    console.log("Created Persons");

    fs.readFile("routes/partsData.csv", async (err, data) => {
        if (err) {
            console.log(err);
        }
        let parts;
        parts = await neatCsv(data);
        console.log(parts);
        parts.forEach(part => {
            Parts.create({
                Type: part.type,
                Model: part.model,
                Quantity: part.quantity,
                Price: part.price,
                InstallationDate: part.installationDate,
                DeviceId: part.devID
            });
        });
    });

    req.flash("success", "Test Accounts And Devices Were Added Successfully");
    res.redirect('/auth/login');
});

router.get("/userlist", isAuth, (req, res) => {
    User.findAll().then(
        users => {
            res.render("users", {
                title: "Users List",
                users
            });
        }
    )
});


router.post('/delete', isAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.body.usersID
        }
    });
    res.redirect('/indoor');
});

// router.post('/register', [
//     check('email').isEmail().withMessage('Invalid Email').normalizeEmail(),
//     check('password').isLength({min: 6}).withMessage('Password Must Be At Least 6 Chars Long'),
//     body('password2').custom((value, {req}) => {
//         if (value !== req.body.password) {
//             throw new Error('Passwords Don\'t Match');
//         }
//         // Indicates the success of this synchronous custom validator
//         return true;
//     }),
//     check('name').isLength({min: 2}).withMessage('Invalid Name').escape(),
//     check('nid').isLength({min: 14, max: 14}).withMessage('NID must be 14 numbers')
//         .isNumeric({no_symbols: true}).withMessage('NID should only contain numbers').escape(),
//     check('phone').isMobilePhone("any").withMessage('Invalid Phone Number').escape(),
//
// ], NotAuth, function (req, res, next) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.render('register', {
//             req: req.body,
//             title: "Register",
//             errors: errors.array()
//         });
//         //res.status(422).json({ errors: errors.array() });
//     }
//     let chance = new Chance();
//     const {name, email, nid, password, phone, doctor, title} = req.body;
//     if (doctor === "true") {
//         Doctor.findOne({
//             where: {
//                 [Op.or]: [
//                     {Email: email},
//                     {Phone: phone},
//                     {NID: nid}
//                 ]
//             },
//             attributes: ['email']
//         })
//             .then(doctor => {
//                 if (!doctor) {
//                     let hash = chance.string({length: 128});
//                     // create that user as no one by that username exists
//                     Doctor.create({
//                         Name: name,
//                         Email: email,
//                         NID: nid,
//                         Password: password,
//                         Phone: phone,
//                         ActiveHash: hash,
//                         Title: title
//                     })
//                         .then(function () {
//                                 const msg = {
//                                     to: email,
//                                     from: 'no-reply@ieeecusb.org',
//                                     subject: 'Verify Your DCareMax Account',
//                                     templateId: 'd-b94fbfd3648a4a60b14eee5d6b6e147c',
//                                     dynamic_template_data: {
//                                         hash: hash,
//                                     }
//                                 };
//                                 sgMail.send(msg);
//                                 // set the flash message to indicate that user was
//                                 // registered successfully
//                             req.flash('success', 'The user was registered successfully');
//                                 // finally redirect to login page, so that they can login
//                                 // and start using our features
//                                 res.redirect('/auth/login');
//                             }
//                         ).catch(function (err, user) {
//                             throw err;
//
//                         }
//                     );
//                 } else {
//                     // there's already someone with that username
//                     res.render('register', {
//                         user: req.user,
//                         message: "Account Already Exists",
//                         title: "Register"
//                     });
//                 }
//             })
//             .catch(function (err) {
//                 throw err;
//             })
//     } else {
//         Patient.findOne({
//             where: {
//                 [Op.or]: [
//                     {Email: email},
//                     {Phone: phone},
//                     {NID: nid}
//                 ]
//             },
//             attributes: ['email'],
//         })
//             .then(patient => {
//                 if (!patient) {
//                     let hash = chance.string({length: 128});
//
//                     // create that user as no one by that username exists
//                     Patient.create({
//                         Name: name,
//                         Email: email,
//                         NID: nid,
//                         Password: password,
//                         Phone: phone,
//                         ActiveHash: hash
//                     })
//                         .then(function () {
//                                 // set the flash message to indicate that user was
//                                 // registered successfully
//                             req.flash('success', 'The user was registered successfully');
//                                 // finally redirect to login page, so that they can login
//                                 // and start using our features
//                                 res.redirect('/auth/login');
//                             }
//                         ).catch(function (err, user) {
//                             throw err;
//
//                         }
//                     );
//                 } else {
//                     // there's already someone with that username
//                     res.render('register', {
//                         user: req.user,
//                         message: "Account Already Exists",
//                         title: "Register"
//                     });
//                 }
//             })
//             .catch(function (err) {
//                 throw err;
//             })
//     }
//
//
// });

router.get('/logout', isAuth, function (req, res, next) {
    res.clearCookie('remember_me');
    req.logout();
    req.flash('success', "You're Logged Out");
    res.redirect('/auth/login');
});

// fs.readFile('routes/DevicesData.csv',   async (err, data) => {
//     if (err) {
//         console.log('errorrrr')
//         console.error(err)
//         return
//     }
//     let devicesList;
//     devicesList = await neatCsv(data);
//     console.log(devicesList[1]);
//     }
// );

// const results = [];
//
// fs.createReadStream('routes/DevicesData.csv')
//     .pipe(csv())
//     .on('data', (data) => results.push(data))
//     .on('end', () => {
//         console.log(results[0]);
//     });


module.exports = router;