'use strict';
const bcrypt = require('bcryptjs');
const models = require('../models');
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        Name: DataTypes.STRING,
        Email: {
            type: DataTypes.STRING,
            isEmail: true,
            unique: true
        },
        Phone: DataTypes.STRING,
        Password: DataTypes.STRING,
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        ActiveHash: DataTypes.STRING,
        RememberHash: DataTypes.STRING,
        Photo: {
            type: DataTypes.STRING,
            defaultValue: "default.png"
        },
        Title: DataTypes.STRING,
        birthday: DataTypes.DATEONLY,
    }, {
        classMethods: {
            comparePassword: async function (Password, hash) {
                // if bcrypt.compare() succeeds it'll call our function with
                // (null, true), if password doesn't match it calls our function
                // with (null, false), if it errors out it calls our function
                // with (err, null)
                await bcrypt.compare(Password, hash, function (err, isMatch) {
                    return isMatch;
                });
            }
        },

    });

    // This hook is called when an entry is being added to the back end.
    // This method is used to hash the password before storing it
    // in our database.
    User.associate = function (models) {
        // associations can be defined here
        User.hasMany(models.WorkOrder);
        User.belongsTo(models.Department);

    };
    User.beforeCreate((User, options) => {
        return bcrypt.genSalt(10).then(async salt => {
            await bcrypt.hash(User.Password, salt).then(async hash => {
                    User.Password = hash;
                }
            ).catch(err => {
                throw new Error();
            })
        }).catch(err => {
            throw new Error();
        })

    });
    User.beforeUpdate((User, options) => {
        // if(User.Password.length > 6)
        // {
        //     return bcrypt.genSalt(10).then(async salt => {
        //         await bcrypt.hash(User.Password, salt).then(async hash => {
        //                 User.Password = hash;
        //             }
        //         ).catch(err => {
        //             throw new Error();
        //         })
        //     }).catch(err => {
        //         throw new Error();
        //     })
        // }


    });
    User.prototype.comparePass = function (password) {
        console.log("From Model: " + password);
        return bcrypt.compareSync(password, this.Password);
        //      .then(isMatch =>{
        //     console.log(isMatch);
        //     return isMatch;
        // }).catch(err => {
        //     throw new Error();})
        //
    };

    return User;
};
