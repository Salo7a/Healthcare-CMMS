'use strict';
const models = require('../models');

module.exports = (sequelize, DataTypes) =>
{
    const Department = sequelize.define('Department', {
        // attributes
        Name: {
            type: DataTypes.STRING,
            unique: true
        }
    }, {});
    
    Department.associate = function (models) {
        // associations can be defined here
        Department.hasMany(models.Device);
        Department.hasMany(models.Indoor);
        Department.hasMany(models.User);
        Department.hasMany(models.Notification);
    };
    
    return Department;
};