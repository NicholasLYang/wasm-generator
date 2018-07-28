const path = require("path");
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: "./src/index.js",
    target: "node",
    externals: [nodeExternals()],
    module: {
	rules: [
	    {
		test: /\.tsx?$/,
		use: 'ts-loader',
		exclude: /node_modules/
	    }
	]
    },
    resolve: {
	extensions: [ 'tsx', 'ts', 'js' ]
    },
    output: {
	filename: "build.js",
	path: path.resolve(__dirname, 'dist')
    }
}
