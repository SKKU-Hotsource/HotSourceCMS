module.exports = function(sequelize, DataTypes) {
    var MainAdmin = sequelize.define("MainAdmin", {
        mainLogo: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "로고파일 경로"
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "홈페이지 제목"
        },
        useSlide: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            comment: "0:슬라이드 사용안함 1:슬라이드 사용함"
        }
    }, {
        tableName: 'main_admin',
        comment: "메인화면관리자",
        classMethods: {
            associate: function(models) {
            }
        }
    });
    return MainAdmin;
};