const jwt = require('jsonwebtoken');

// Extract the jwt values from the environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SKIP_AUTH = process.env.JWT_SKIP_AUTH || 'false';
const JWT_DURATION = process.env.JWT_DURATION || '1h';

// Define the login middleware
module.exports.login = (req, res) => {
	const { username } = req.body;

	// Check if the username is provided and if it's a string.
	if (!username || typeof username !== 'string') {
		return res.status(400).send('Bad request: missing username');
	}

	// Create a JWT token
	const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_DURATION });
		
	res.send(token);
};

// Define the authenticateJWT middleware
module.exports.handleAuth = (req, res, next) => {
	if (JWT_SKIP_AUTH === 'true') {
		next();
		return;
	}

	const authHeader = req.headers.authorization;
	
	// Check if the 'authorization' header is provided.
	if (authHeader) {
		// Split the header to get the actual JWT. This assumes the format is 'Bearer [token]'.
		const token = authHeader.split(' ')[1];

		// Verify the provided JWT using the secret key.
		jwt.verify(token, JWT_SECRET, (err) => {
			if (err) {
				return res.status(403).send('Forbidden');
			}
			
			next();
		});
	} else {
		res.status(401).send('Unauthorized');
	}
};
