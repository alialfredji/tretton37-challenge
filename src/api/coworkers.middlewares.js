const Sequelize = require('sequelize');
const fetch = require('node-fetch');
const { getCoworkersModel } = require('../postgres');

// Middleware to fetch details of a single coworker by their 'id'
module.exports.getSingle = async (req, res) => {
	const { id } = req.params;
	const model = getCoworkersModel();

	let coworker = null;
	try {
		// Fetch the coworker from the database based on the 'id'
		coworker = await model.findOne({
			where: { id },
			raw: true,
			attributes: [ 'name', 'bio', 'pic' ], // Only fetch these columns
		});
	} catch (err) {
		res.status(500).send('Internal server error');
		return; 
	}

	// Check if a coworker was found
	if (!coworker) {
		res.status(404).send('Not found');
		return; 
	}

	res.send({
		name: coworker.name,
		text: coworker.bio,
		imagePortraitUrl: coworker.pic,
	});
};

// Middleware to edit details of a single coworker
module.exports.editSingle = async (req, res) => {
	const { id, name, city, text } = req.body;

	// Check if the 'id' is present
	if (!id) {
		res.status(400).send('Bad request: missing id');
		return;
	}

	// Check if there's anything to update
	if (!name && !city && !text) {
		res.status(400).send('Bad request: nothing to update');
		return;
	}

	const model = getCoworkersModel();

	let coworker = null;
	try {
		// Update the coworker in the database based on the 'id' and the provided details
		coworker = await model.update({
			// Only include fields in the update if they're provided in the request
			...(name ? { name } : {}),
			...(city ? { city } : {}),
			...(text ? { bio: text } : {}),
		}, {
			where: { id },
			returning: true,
		});
		
		coworker = coworker?.[1]?.[0] || null;
	} catch (err) {
		// Handle any database errors
		res.status(500).send('Internal server error');
		return;
	}

	// Check if a coworker was updated
	if (!coworker) {
		res.status(404).send('Not found');
		return;
	}

	res.send({
		name: coworker.name,
		city: coworker.city,
		text: coworker.bio,
	});
};

// Exported middleware function to fetch coworkers based on query parameters
module.exports.getMany = async (req, res) => {
	const start = parseInt(req.query.start) || 0;
	const end = parseInt(req.query.end) || null;	
	const filter = req.query.filter || null;
	
	let coworkers = null;
	try {
		// Fetch coworkers from the database based on the parsed query parameters
		coworkers = await getCoworkersModel().findAll({
			raw: true,
			order: [[ 'id', 'ASC' ]],
			...(start ? { offset: start - 1 } : {}),
			...(end ? { limit: end - start + 1 } : {}),
			...(filter ? {
				where: {
					name: {
						[Sequelize.Op.iRegexp]: filter,
					},
				},
			} : {}),
		});
	} catch (err) {
		// Handle any database errors
		res.status(500).send('Internal server error');
		return; 
	}

	res.send({
		data: coworkers.map(i => ({
			id: Number(i.id),
			name: i.name,
			city: i.city,
			country: i.country,
			text: i.bio,
			imagePortraitUrl: i.pic,
			imageFullUrl: i.secPic,
		})),
		totalLength: coworkers.length,
	});
};

// Middleware function to repopulate the coworkers in the database from the external API
module.exports.resetData = async (req, res) => {
	try {
		// Download coworker data from the external API
		const fetchRes = await fetch('http://meet.1337co.de/api/employees');
		const json = await fetchRes.json();

		// Create a mapping of city names to country codes
		const citiesToCountryMap = [...new Set(json.map(i => i.office))]
			.reduce((acc, curr) => ({
				...acc,
				[curr]: curr === 'Ljubljana' ? 'SI' : 'SE',
			}), {});

		// Filter only the published coworkers, then transform them to match the model's format
		const coworkers = json
			.filter(i => i.published)
			.map(i => ({
				name: i.name,
				city: i.office,
				country: citiesToCountryMap[i.office],
				pic: i.imagePortraitUrl,
				secPic: i.imageWallOfLeetUrl,
				// Clean up the mainText by removing HTML tags
				bio: i.mainText ? i.mainText.replace(/<p>/g, '').replace(/<\/p>/g, '\n') : null,
			}));

		// Remove all existing coworkers from the database
		await getCoworkersModel().destroy({
			where: {},
			truncate: true,
			cascade: true,
			restartIdentity: true,
		});

		// Add the newly fetched coworkers into the database
		await getCoworkersModel().bulkCreate(coworkers);

		res.send('Coworkers repopulated');
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Internal server error');
		return;
	}
};
