'use strict';
module.exports = (sequelize, DataTypes) => {
    const Parts = sequelize.define('Parts', {
        firstName: DataTypes.STRING
    }, {});
    Parts.associate = function (models) {
        // associations can be defined here
    };
    return Parts;
};