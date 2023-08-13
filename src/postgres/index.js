const Sequelize = require('sequelize');
const coworkersModel = require('./coworkers.model');

const setupTables = async (conn) => {
	// Initialize the models for the coworkers 
	await coworkersModel.init(conn);

	// Synchronize the connection (ensure that all tables and relations are properly set up)
	await conn.sync();
};

module.exports.getCoworkersModel = coworkersModel.getModel;

// initializes a new connection to a PostgreSQL database.
module.exports.init = (pgString, options = {}) => new Promise((resolve, reject) => {

	// Create a new Sequelize connection instance
	const conn = new Sequelize(pgString, {
		logging: false,
		...(options || {}),
		dialect: 'postgres',
		dialectOptions: {
			ssl: {
				require: options.sslRequired || false,
			},
		},
	});

	// Attempt to authenticate the connection.
	conn.authenticate()
		.then(() => {
			console.log('[postgres]: Connection has been established successfully.');
			setupTables(conn)
				.then(() => resolve())
				.catch(err => reject(err));
		})
		.catch(err => {
			console.error('[postgres]: Unable to connect to the database:', err);
			reject(err);
		});
});
