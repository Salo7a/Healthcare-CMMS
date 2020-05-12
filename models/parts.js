'use strict';
const models = require('../models')
module.exports = (sequelize, DataTypes) => {
    const Parts = sequelize.define('Parts', {
        // attributes
        Type: DataTypes.STRING,
        Model: DataTypes.STRING,
        Quantity: DataTypes.INTEGER,
        Price: DataTypes.STRING,
        InstallationDate: DataTypes.DATEONLY
    });
    Parts.associate = function (models) {
        // associations can be defined here
        Parts.belongsTo(models.Device)
    };
    return Parts;
};