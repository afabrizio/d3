const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	devServer: {
		contentBase: path.join(__dirname, 'public/'),
		hotOnly: true,
		port: 8080,
		publicPath: 'http://localhost:8080/dist/'
	},
	devtool: 'inline-source-map',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				options: {
					presets: [
						"@babel/env"
					]
				}
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin([ 'dist' ]),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			title: 'd3 Library'
		})
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist/'),
		publicPath: '/dist/'
	},
	resolve: {
		extensions: [ '*', '.js', '.jsx' ]
	}
};
