module.exports = function(sequelize, DataTypes) {
    var Post = sequelize.define("Post", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "글의 제목"
        },

        contents: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "",
            comment: "글의 내용"
        },       

        author: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "작성자 이름"
        },

        cnt: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "조회수"
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: true/*,
            validate: {
                isIPv4: true
            }*/
        }
       
    }, {
        tableName: 'post',
        comment: "게시물",
        classMethods: {
            associate: function(models) {
                Post.hasMany(models.Attachment,{onDelete:'CASCADE',onUpdate:'CASCADE'});
            }
        }
    });
    return Post;
};