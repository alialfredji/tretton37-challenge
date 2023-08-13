// Load environment variables from '.env' file into process.env
require('dotenv').config();

// setup
module.exports = async () => {
	// Check that all required environment variables are set
	console.log('[env]: Checking environment variables...');
	await Promise.all([
		'JWT_SECRET',
		'PG_STRING',
		'PG_SSL_REQUIRED',
		'PORT',
		'JWT_SKIP_AUTH',
	].map(key => {
		if (!process.env[key]) {
			throw new Error(`Missing ${key} environment variable`);
		}
	}));
	console.log('[env]: Environment variables OK');

	// Set up and initialize the Postgres database
	console.log('[postgres]: Initializing...');
	await require('./postgres').init(process.env.PG_STRING, {
		sslRequired: process.env.PG_SSL_REQUIRED === 'true',
	});
	console.log('[postgres]: Initialized');


	// Set up and initialize the API 
	console.log('[api]: Initializing...');
	await require('./api').init(process.env.PORT || 8080);
	console.log('[api]: Initialized');
};
