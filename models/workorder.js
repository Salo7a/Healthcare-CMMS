'use strict';
const models = require('../models');
module.exports = (sequelize, DataTypes) => {
    const WorkOrder = sequelize.define('WorkOrder', {
        type: DataTypes.STRING,
        // for Alert Type
        alert: DataTypes.JSON,
        // for Daily type
        daily: DataTypes.JSON,
        // for PPM Type
        ppm: DataTypes.JSON,
        State: DataTypes.STRING,
        Date: DataTypes.DATEONLY
    }, {});
    WorkOrder.associate = function (models) {
        // associations can be defined here
        // WorkOrder.belongsTo(models.Indoor,{
        //     as: 'engineer',
        //     foreignKey: 'EngineerId',
        //     targetKey: 'id'
        // });
        WorkOrder.belongsTo(models.Device);
        WorkOrder.belongsTo(models.Department);
        WorkOrder.belongsTo(models.User);
        WorkOrder.hasOne(models.Notification);
    };

    return WorkOrder;
};