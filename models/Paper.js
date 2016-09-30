module.exports = function(sequelize, DataTypes) {
    var Paper = sequelize.define("Paper", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "논문 이름"
        },
        lead_author: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "제1저자"
        },
        corresponding_author: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "교신저자"
        },
        co_author: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "공동저자"
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "논문 링크"
        },
        publication_name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "저널or학회 이름"
        },
        count_of_origin: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "1:국외 0:국내"
        },
        publication_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "1:저널 0:컨퍼런스"
        },
        citation_index: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "(저널인 경우) 1:SCI 2:SCIE 3:ETC"
        },
        vol: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "권, volume"
        },
        no: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "호, number"
        },
        pp: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "페이지,page ex)11~22"
        },
        publish_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            comment: "게제일"
        },
        format: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "(저널인 경우) 1:online 0:paper"
        }

    }, {
        tableName: 'paper',
        comment: "논문 정보",
        classMethods: {
            associate: function(models) {
            }
        }
    });
    return Paper;
};