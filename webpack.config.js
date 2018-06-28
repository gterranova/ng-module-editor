const path = require('path');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    target: 'node',
    devtool: 'none',
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
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        library: 'ts-modify',
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, 'dist')
    },
    //plugins: [new UglifyJsPlugin()]
};
