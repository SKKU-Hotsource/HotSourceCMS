module.exports = function(sequelize, DataTypes) {
    var Attachment = sequelize.define("Attachment", {
        file_name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: ""
        },
        
        path: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: ""
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        downs: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
       
      
    }, {
        tableName: 'attachment',
        comment: "",
        classMethods: {
            associate: function(models) {
            }
        }
    });
    return Attachment;
};