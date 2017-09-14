module.exports = function (sequelize, DataTypes) {
  var Group = sequelize.define('Group', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Group.associate = function (models) {
    Group.belongsToMany(models.User, {through: models.UserGroup});
    Group.hasMany(models.Discussion, {
      onDelete: "cascade"
    });
  };

  return Group;
};


