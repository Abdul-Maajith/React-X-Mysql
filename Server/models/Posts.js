// In order to create a table(Mysql) , we have created a JS file on modules(sequelize).

module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("Posts", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postText: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
   
    // Here, we are just associating the comments with the post, i.e.. In comments table, we'll have postId as a foreign key!

    // Also we are associating likes button with the post, i.e...In likes table, we'll have postId as a foreign key!

    // On deleting the post, comments will automatically get deleted!
    
    Posts.associate = (models) => {
      Posts.hasMany(models.Comments, {
        onDelete: "cascade",
      });

      Posts.hasMany(models.Likes, {
        onDelete: "cascade",
      });
    }

    return Posts
}