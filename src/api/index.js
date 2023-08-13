
const express = require('express');
const bodyParser = require('body-parser');

const authMiddlewares = require('./auth.middlewares');
const coworkersMiddlewares = require('./coworkers.middlewares');

const setupMiddlewares = (app) => {
	// Set up routes for the API 

	app.post('/api/login', authMiddlewares.login);

	app.get('/api/coworkers', [
		authMiddlewares.handleAuth,
		coworkersMiddlewares.getMany,
	]);

	app.get('/api/coworker/:id', [
		authMiddlewares.handleAuth,
		coworkersMiddlewares.getSingle,
	]);

	app.post('/api/coworker', [
		authMiddlewares.handleAuth,
		coworkersMiddlewares.editSingle,
	]);

	app.post('/api/reset-coworkers', [
		authMiddlewares.handleAuth,
		coworkersMiddlewares.resetData,
	]);

};

// Initialize and export a function that sets up and starts the server
module.exports.init = (port = 8080) => new Promise((resolve) => {
	// Creating a new Express application
	const app = express();

	// Using 'bodyParser.json()' middleware to parse incoming request bodies in a middleware before your handlers
	app.use(bodyParser.json());

	setupMiddlewares(app);
    
	// Starting the server on the given port (default 8080 if not specified)
	app.listen(port, () => {
		// Logging the port number once the server is up and running
		console.log(`[api]: server running on port ${port}`);
		resolve(app); // Resolving the promise with the 'app' instance
	});
});