'use strict';
module.exports = (sequelize, DataTypes) => {
    const Template = sequelize.define('Template', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING
    }, {});
    Template.associate = function (models) {
        // associations can be defined here
    };
    return Template;
};