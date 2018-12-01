const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	plugins: [
		new CleanWebpackPlugin([ 'dist' ]),
		new HtmlWebpackPlugin({
			title: 'd3 Library'
		})
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};
