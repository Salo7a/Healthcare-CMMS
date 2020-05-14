'use strict';
const models = require('../models');
module.exports = (sequelize, DataTypes) => {
    const WorkOrder = sequelize.define('WorkOrder', {
        name: DataTypes.STRING,
        date: DataTypes.STRING

    }, {});
    WorkOrder.associate = function (models) {
        // associations can be defined here
        WorkOrder.belongsTo(models.Indoor,{
            as: 'engineer',
            foreignKey: 'EngineerId',
            targetKey: 'id'
        });
        WorkOrder.belongsTo(models.Device);
        WorkOrder.belongsTo(models.Department);
    };

    return WorkOrder;
};