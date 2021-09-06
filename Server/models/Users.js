// In order to create a table(Mysql) , we have created a JS file on modules(sequelize).

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Here, we are just associating the user with the post, i.e.. In user table, we'll have postId as a foreign key!

  //   Users.associate = (models) => {
  //     Users.hasMany(models.Posts, {
  //       onDelete: "cascade",
  //     })
  //   }

  // each user can like each post, userId must be invoked in likes table!
  Users.associate = (models) => {
    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });
    
    Users.hasMany(models.Posts, {
      onDelete: "cascade",
    });
  };

  return Users;
};
