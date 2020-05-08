'use strict';
module.exports = (sequelize, DataTypes) => {
    const WorkQueue = sequelize.define('WorkQueue', {
        firstName: DataTypes.STRING
    }, {});
    WorkQueue.associate = function (models) {
        // associations can be defined here
    };
    return WorkQueue;
};