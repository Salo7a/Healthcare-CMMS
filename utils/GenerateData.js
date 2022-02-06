const User = require('../models').User;
const Device = require('../models').Device;
const Department = require('../models').Department;
const Indoor = require("../models").Indoor;
const Parts = require("../models").Parts;
const WorkOrder = require("../models").WorkOrder;
const Notification = require('../models').Notification;
const {Op} = require('sequelize');
const {format, formatDistance, subDays, addDays, isToday, endOfDay, parseISO, isBefore} = require('date-fns');
const random = require('random');
const fs = require('fs');
const neatCsv = require('neat-csv');
module.exports = {
    AddTestData: async function (req, res, next) {
        const departmentsList = [{"Cardiac Catheterization": 1}, {"Surgery Care": 2}, {"Cardiology": 3}, {"Emergency": 4}];
        for (let i = 0; i < departmentsList.length; i++) {
            await Department.create({
                Name: Object.keys(departmentsList[i])[0]
            });
        }
        await User.create({
            Name: "John Doe",
            Email: "admin@clinical.com",
            Phone: "01123456789",
            Title: "Head of Engineering",
            Password: "password",
            isAdmin: true,
            DepartmentId: 1
        });
        await User.create({
            Name: "Jane Doe",
            Email: "technician@clinical.com",
            Phone: "01123456789",
            Title: "MRI Technician",
            Password: "password",
            isAdmin: false,
            DepartmentId: 1
        });

        fs.readFile(__dirname + '/DevicesData.csv', async (err, data) => {
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
                await Device.create({
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

        await fs.readFile(__dirname + "/indoor.csv", async (err, data) => {
            if (err) {
                console.log(err);
            }
            let indoor;
            indoor = await neatCsv(data);
            console.log(indoor);
            await indoor.forEach( person => {
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
        await fs.readFile(__dirname + "/partsData.csv", async (err, data) => {
            if (err) {
                console.log(err);
            }
            let parts;
            parts = await neatCsv(data);
            console.log(parts);
            await parts.forEach( async part => {
                await Parts.findOrCreate({
                    where: {
                        Type: part.type,
                        Model: part.model,
                        Quantity: part.quantity,
                        Price: part.price,
                        InstallationDate: part.installationDate,
                        DeviceId: part.devID
                    }
                });
            });
        });

    },
    GenerateDates: function (req, res, next) {
        Device.findAll().then(async Devices => {
            let today = endOfDay(new Date()).toISOString();
            await Devices.forEach(device => {
                if (!isToday(parseISO(device.LastDaily)) && device.PPMInterval < 365) {
                    device.LastDaily = subDays(parseISO(today), 1)
                }
                let ran = random.int(min = -8, max = 2);
                console.log(ran);
                device.LastPPM = subDays(parseISO(today), ran + device.PPMInterval);
                device.save();
            })
        })
    },
    GenerateOrders: async function (req, res, next) {
        let dailyorder1 = await WorkOrder.findOrCreate({
            where: {
                type: "Daily",
                DepartmentId: "1",
                Date: new Date(),
                State: "Pending"

            }
        });
        let dailyorder2 = await WorkOrder.findOrCreate({
            where: {
                type: "Daily",
                DepartmentId: "2",
                Date: new Date(),
                State: "Pending"
            }
        });
        let dailyorder3 = await WorkOrder.findOrCreate({
            where: {
                type: "Daily",
                DepartmentId: "3",
                Date: new Date(),
                State: "Pending"
            }
        });
        let dailyorder4 = await WorkOrder.findOrCreate({
            where: {
                type: "Daily",
                DepartmentId: "4",
                Date: new Date(),
                State: "Pending"
            }
        });
        let dailyorder = [dailyorder1, dailyorder2, dailyorder3, dailyorder4];
        Device.findAll().then(async  Devices => {
            let daily = [{}, {}, {}, {}];
            for (const device of Devices) {
                console.log(isToday(addDays(new Date(device.LastPPM), device.PPMInterval)));
                if (isToday(addDays(new Date(device.LastPPM), device.PPMInterval))) {
                     await WorkOrder.findOrCreate({
                        where: {
                            type: "PPM",
                            State: "Pending",
                            DepartmentId: device.DepartmentId,
                            DeviceId: device.id,
                            Date: new Date()
                        }
                    }).then(async order => {
                        if (order[1]) {
                            await Notification.create({
                                Type: "PPM",
                                Date: new Date(),
                                DepartmentId: device.DepartmentId,
                                DeviceId: device.id,
                                WorkOrderId: order[0].id
                            })
                        }
                    })
                } else if (isBefore(addDays(new Date(device.LastPPM), device.PPMInterval), new Date())) {
                    await WorkOrder.findOrCreate({
                        where: {
                            type: "PPM",
                            State: "Completed",
                            DepartmentId: device.DepartmentId,
                            DeviceId: device.id,
                            Date: addDays(new Date(device.LastPPM), device.PPMInterval)
                        }
                    })
                } else {
                    await  WorkOrder.findOrCreate({
                        where: {
                            type: "PPM",
                            State: "Pending",
                            DepartmentId: device.DepartmentId,
                            DeviceId: device.id,
                            Date: addDays(new Date(device.LastPPM), device.PPMInterval)
                        }
                    })
                }
                if (!isToday(parseISO(device.LastDaily))) {
                    daily[device.DepartmentId - 1][device.id] = {
                        Name: device.Name,
                        Serial: device.Serial,
                        State: "Pending"
                    };
                    console.log(dailyorder[device.DepartmentId - 1][1]);
                    if (dailyorder[device.DepartmentId - 1][1]) {
                        dailyorder[device.DepartmentId - 1][0].daily = daily[device.DepartmentId - 1];
                        dailyorder[device.DepartmentId - 1][0].Status = "Pending";
                        dailyorder[device.DepartmentId - 1][0].save();
                    }
                }
            }

                const newNotification1 = {
                    Type: 'Daily',
                    Date: new Date(),
                    DepartmentId: "1"
                };
                await Notification.findOne({
                    where: {
                        Type: 'Daily',
                        Date: new Date(),
                        DepartmentId: "1"
                    }
                }).then((noti) => {
                    if (!noti) {
                        Notification.create(newNotification1)
                    }
                    const newNotification2 = {
                        Type: 'Daily',
                        Date: new Date(),
                        DepartmentId: "2"
                    };
                    Notification.findOne({
                        where: {
                            Type: 'Daily',
                            Date: new Date(),
                            DepartmentId: "2"
                        }
                    }).then((noti) => {
                        if (!noti) {
                            Notification.create(newNotification2)
                        }
                        const newNotification3 = {
                            Type: 'Daily',
                            Date: new Date(),
                            DepartmentId: "3"
                        };
                        Notification.findOne({
                            where: {
                                Type: 'Daily',
                                Date: new Date(),
                                DepartmentId: "3"
                            }
                        }).then((noti) => {
                            if (!noti) {
                                Notification.create(newNotification3)
                            }
                            const newNotification4 = {
                                Type: 'Daily',
                                Date: new Date(),
                                DepartmentId: "4"
                            };
                            Notification.findOne({
                                where: {
                                    Type: 'Daily',
                                    Date: new Date(),
                                    DepartmentId: "4"
                                }
                            }).then((noti) => {
                                if (!noti) {
                                    Notification.create(newNotification4)
                                }
                            });
                        });
                    });
                });
            WorkOrder.findAll().then(orders => {
                orders.forEach(async order => {
                    if (isBefore(new Date(order.Date), new Date())) {
                        order.Status = 'Completed';
                        await order.save();
                    }
                })
            })
        });
    },
    GenerateQueue: function (req, res, next) {
        next();
    },
    GenerateNotifications: function (req, res, next) {
        console.log("Generate Notifications");
        Notification.findAll({where:{
            Date: {[Op.ne]: new Date()}
            }}).then(noti=>{
                console.log(noti);
                noti.forEach(notif=>{
                        notif.destroy();
                        notif.save();
                })
        })
        WorkOrder.findAll({
            where: {
                Date: new Date()
            }
        }).then( orders => {
                console.log(orders);
                orders.forEach(async order => {
                    if (order.type === "PPM") {
                        await Notification.findOne({
                            where: {
                                Type: "PPM",
                                Date: new Date(),
                                DepartmentId: order.DepartmentId,
                                DeviceId: order.DeviceId,
                                WorkOrderId: order.id
                            }
                        }).then((noti) => {
                            if (!noti) {
                                Notification.create({
                                    Type: "PPM",
                                    Date: new Date(),
                                    DepartmentId: order.DepartmentId,
                                    DeviceId: order.DeviceId,
                                    WorkOrderId: order.id
                                })
                            }
                        });

                    }
                });
            }
        )
    }
};