module.exports = function (sequelize, DataTypes) {
  var Discussion = sequelize.define('Discussion', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Discussion.associate = function (models) {
    Discussion.belongsTo(models.Group, {
        foreignKey: {
            allowNull: false
        }
    })
  };

  return Discussion;
};