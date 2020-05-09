'use strict';
module.exports = (sequelize, DataTypes) => {
    const Inventory = sequelize.define('Inventory', {
        Item: DataTypes.STRING,
        Price: DataTypes.INTEGER
    }, {});
    Inventory.associate = function (models) {
        // associations can be defined here
    };
    return Inventory;
};