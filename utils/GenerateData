const User = require('../models').User;
const Device = require('../models').Device;
const Department = require('../models').Department;
const Indoor = require("../models").Indoor;
const WorkOrder = require("../models").WorkOrder;
const WorkQueue = require("../models").WorkQueue;
const {Op} = require('sequelize');
const {format, formatDistance, subDays, addDays, isToday, endOfDay, parseISO, isDate} = require('date-fns');
const random = require('random');
const fs = require('fs');
module.exports = {
    AddTestData: function (req, res, next) {
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

        const departmentsList = [{"Cardiac Catheterization": 1}, {"Surgery Care": 2}, {"Cardiology": 3}, {"Emergency": 4}];
        for (let i = 0; i < departmentsList.length; i++) {
            Department.create({
                Name: Object.keys(departmentsList[i])[0]
            });
        }

        fs.readFile(__dirname + '../routes/DevicesData.csv', async (err, data) => {
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
                    DepartmentId: currentDepID,
                    PPMInterval: devicesList[i].PPMInterval
                });
            }
            console.log('Created!')
        });

        fs.readFile(__dirname + "./routes/indoor.csv", async (err, data) => {
            if (err) {
                console.log(err);
            }
            let indoor;
            indoor = await neatCsv(data);
            console.log(indoor);
            indoor.forEach(person => {
                Indoor.create({
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
    },
    GenerateDates: function (req, res, next) {
        Device.findAll().then(Devices => {
            let today = endOfDay(new Date()).toISOString();
            Devices.forEach(device => {
                if (!isToday(parseISO(device.LastDaily)) && device.PPMInterval < 365) {
                    device.LastDaily = subDays(parseISO(today), 1)
                }
                if (!device.LastPPM) {
                    let ran = random.int(min = -1, max = 2);
                    console.log(ran);
                    device.LastPPM = subDays(parseISO(today), ran + device.PPMInterval)
                }
                device.save();
            })
        })
    },
    GenerateOrders: async function (req, res, next) {
        let dailyorder = await WorkOrder.create({
            type: "Daily",
            Date: new Date()
        });
        let daily = {};
        Device.findAll().then(Devices => {
            let daily = {};
            Devices.forEach(device => {
                console.log(isToday(addDays(new Date(device.LastPPM), device.PPMInterval)));
                if (isToday(addDays(new Date(device.LastPPM), device.PPMInterval))) {
                    console.log('PPM');
                    WorkOrder.create({
                        type: "PPM",
                        State: "Pending",
                        DepartmentId: device.DepartmentId,
                        DeviceId: device.id,
                        Date: new Date()
                    })
                }
                if (!isToday(parseISO(device.LastDaily))) {
                    daily[device.id] = {
                        Name: device.Name,
                        Serial: device.Serial,
                        Status: "Pending"
                    };
                    dailyorder.daily = daily;
                    dailyorder.save()
                }
            })
        });
    },
    GenerateQueue: function (req, res, next) {
        next();
    }
};