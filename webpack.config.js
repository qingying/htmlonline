var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: {
		index: './src/index.js'
	},
	output: {
		path: './build',
        filename: 'index.js'
	},
	module: {
		loaders: [{
			test: /.(js|jsx)?$/,
			include: [path.join(__dirname, 'js')],
			loaders: ['babel-loader?presets[]=es2015&presets[]=stage-0&presets[]=stage-1&presets[]=stage-2&presets[]=stage-3']
		}]
	},
	target: 'node'
}