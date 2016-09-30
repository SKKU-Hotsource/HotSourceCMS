module.exports = function(sequelize, DataTypes) {
    var Popup = sequelize.define("Popup", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "팝업 제목"
        },
        image_src: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "이미지를 불러올 경로"
        },
        path: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "클릭시 연결되는 링크"
        },
        width: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "팝업의 최적 가로 픽셀 너비"
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "팝업의 최적 세로 픽셀 높이"
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            comment: "팝업 시작 날짜"
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            comment: "팝업 종료 날짜"
        },
    },
    {
        tableName: 'popup',
        comment: "팝업 정보를 저장하고 있는 테이블",
        classMethods: {
            associate: function(models) {
            }
        }
    });
    return Popup;
};