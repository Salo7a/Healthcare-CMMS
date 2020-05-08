'use strict';
module.exports = (sequelize, DataTypes) => {
    const WorkOrder = sequelize.define('WorkOrder', {
        firstName: DataTypes.STRING
    }, {});
    WorkOrder.associate = function (models) {
        // associations can be defined here
    };
    return WorkOrder;
};