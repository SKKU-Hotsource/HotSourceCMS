module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        user_id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            comment: "유저 id"
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "유저 이름"
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "sha256 hash 사용, 생성시 http://www.xorbin.com/tools/sha256-hash-calculator 참조"
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "이메일"
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "유저 권한(관리자, 일반사용자)"
        }

    }, {
        tableName: 'user',
        comment: "유저",
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Post, {onDelete:'SET NULL', onUpdate:'CASCADE'});
            }
        }
    });
    return User;
};