'use strict';
module.exports = (sequelize, DataTypes) => {
    const Indoor = sequelize.define('Indoor', {
        firstName: DataTypes.STRING
    }, {});
    Indoor.associate = function (models) {
        // associations can be defined here
    };
    return Indoor;
};