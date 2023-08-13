module.exports = {
	env: {
		node: true,
		jest: true,
		browser: true,
		commonjs: true,
		es2021: true,
	},
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	extends: 'eslint:recommended',
	overrides: [
		{
			env: {
				node: true,
			},
			files: [
				'.eslintrc.{js,cjs}',
			],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	rules: {
		indent: [ 'error','tab' ],
		quotes: [ 'error','single' ],
		semi: [ 'error', 'always' ],
		'comma-dangle': [ 'error', 'always-multiline' ],
		'array-bracket-spacing': [ 'error', 'always', { singleValue: false } ],
	},
};
