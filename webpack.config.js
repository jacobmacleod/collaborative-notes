var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: './public/javascripts/client.js',
    output: {
        path: path.resolve(__dirname, 'public/javascripts/'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        ]
    },
    mode: 'development',
    resolve: {
        fallback: {
            fs: false,
            module: false,
            net: false,
            tls: false,
            'stream': require.resolve('stream-browserify'),
            'buffer': require.resolve('buffer')
        },
        alias: { 'stream': require.resolve('stream-browserify') }
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser.js',
        }),
    ]
};