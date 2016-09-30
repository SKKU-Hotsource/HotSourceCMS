module.exports = function(sequelize, DataTypes) {
    var Category = sequelize.define("Category", {
        category_name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "카테고리 명"
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "카테고리 타입 0:root category 1:information 2:board 3:video"
        },
        sequence: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "동일 부모를 가진 노드들의 순서"
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "카테고리 레벨. 부모가 몇 개나 있는지"
        }
    }, {
        tableName: 'category',
        comment: "카테고리",
        classMethods: {
            associate: function(models) {
                Category.hasMany(models.Post, {onDelete:'CASCADE', onUpdate:'CASCADE'});
                Category.hasMany(models.Paper, {onDelete:'SET NULL', onUpdate:'CASCADE'});
                Category.hasOne(models.MainAdmin, {foreignKey:'leftBoard', onDelete:'SET NULL', onUpdate:'CASCADE'});
                Category.hasOne(models.MainAdmin, {foreignKey:'rightBoard', onDelete:'SET NULL', onUpdate:'CASCADE'});
                Category.hasMany(models.Category, {foreignKey:'parent_seq', onDelete:'CASCADE', onUpdate:'CASCADE'}); //루트 카테고리의 seq
            }
        }
    });
    return Category;
};