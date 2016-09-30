module.exports = function(sequelize, DataTypes)
{
	var Slide = sequelize.define("Slide",
	{
		title:
		{
			type : DataTypes.STRING,
			allowNull : false
		},
		comment: 
		{
			type: DataTypes.TEXT,
			defaultValue: ""
		},
		path:
		{
			type : DataTypes.STRING,
			allowNull: "",
			comment: "업로드한 이미지 경로 또는 파일명"
		},
		seq:
		{
			type: DataTypes.INTEGER,
			allowNull : false,
			comment: "슬라이드 순서"
		},
		link:
		{
			type: DataTypes.STRING,
			defaultValue: "",
			comment: "연결된 링크 (추가시)"
		},
		show:
		{
			type : DataTypes.INTEGER,
			allowNull : false,
			defaultValue : 1,
			comment : "NULL 제외"
		}
	},
	{
		tableName: 'slide',
		comment: "main 슬라이드"
	});
	return Slide;
};
