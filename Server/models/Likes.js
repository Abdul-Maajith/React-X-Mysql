// In order to create a table(Mysql) , we have created a JS file on modules(sequelize).

module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define("Likes");

  return Likes;
};
