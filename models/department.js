'use strict';
const models = require('../models');

module.exports = (sequelize, DataTypes) =>
{
    const Department = sequelize.define('Department', {
        // attributes
        Name: DataTypes.STRING
    }, {});
    
    Department.associate = function (models) {
        // associations can be defined here
        Department.hasMany(models.Device);
        // Department.hasMany(models.Indoor);
    };
    
    return Department;
};