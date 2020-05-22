'use strict';
const models = require('../models');
module.exports = (sequelize, DataTypes) =>
{
    const Notification = sequelize.define('Notification', {
        // attributes
        Name: DataTypes.STRING
    });
    
    Notification.associate = function (models) {
        // associations can be defined here
        Notification.belongsTo(models.Department);
        Notification.belongsTo(models.Device);
        Notification.belongsTo(models.WorkOrder);
    };
    
    return Notification;
};
