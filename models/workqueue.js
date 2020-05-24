'use strict';
const models = require('../models');

module.exports = (sequelize, DataTypes) => {
    const WorkQueue = sequelize.define('WorkQueue', {
        task_name: DataTypes.STRING,
        task_date: DataTypes.STRING,
        task_priority: DataTypes.STRING,
        Status: DataTypes.STRING
    }, {});
    WorkQueue.associate = function (models) {
        // associations can be defined here
        WorkQueue.belongsTo(models.WorkOrder, {
            as: 'workorder'
        });
        WorkQueue.belongsTo(models.User, {
            as: 'engineer',
            foreignKey: 'EngineerId',
            targetKey: 'id'
        });
        WorkQueue.belongsTo(models.Department);
    };
    return WorkQueue;
};