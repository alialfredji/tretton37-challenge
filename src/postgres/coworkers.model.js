const Sequelize = require('sequelize');

// Set up the base name for the model and table
const name = 'Coworker';
const tableName = 'coworkers';
// Initialize a variable to store the model once it's defined
let Model = null;

// Define the fields and their properties for the table
const fields = {
	id: {
		type: Sequelize.DataTypes.BIGINT,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: Sequelize.DataTypes.STRING(255),
		allowNull: false,
	},
	city: {
		type: Sequelize.DataTypes.STRING(255),
		defaultValue: null,
	},
	country: {
		type: Sequelize.DataTypes.STRING(2),
		defaultValue: null,
	},
	pic: {
		type: Sequelize.DataTypes.STRING(255),
		defaultValue: null,
	},
	secPic: {
		type: Sequelize.DataTypes.STRING(255),
		field: 'sec_pic',
		defaultValue: null,
	},
	bio: {
		type: Sequelize.DataTypes.TEXT,
		defaultValue: null,
	},
};

// Define additional options for the model
const options = {
	tableName,           
	freezeTableName: true,  
	underscored: true,     
};

// Exported function to initialize and define the model on the given connection (conn)
module.exports.init = (conn) => {
	Model = conn.define(name, fields, options);
	return Model.sync(); 
};

// Exported function to retrieve the defined model
module.exports.getModel = () => Model;
