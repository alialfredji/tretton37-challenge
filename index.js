
console.log('[BOOT]: STARTING');
require('./src/boot')()
	.then(() => {
		console.log('[BOOT]: DONE');
	})
	.catch( (err) => {
		console.log('[BOOT]: Fatal Error');
		console.log(err);
		process.exit();
	});
