// In order to create a table(Mysql) , we have created a JS file on modules(sequelize).

module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    commentBody: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  return Comments;
};
