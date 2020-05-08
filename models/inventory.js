'use strict';
module.exports = (sequelize, DataTypes) => {
    const Inventory = sequelize.define('Inventory', {
        firstName: DataTypes.STRING
    }, {});
    Inventory.associate = function (models) {
        // associations can be defined here
    };
    return Inventory;
};