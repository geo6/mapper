const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = (env, options) => {
    return {
        entry: {
            'mapper': './resources/javascript/main.js',
        },
        output: {
            filename: '[name].min.js',
            path: path.resolve(__dirname, 'public/js')
        },
        module: {
            rules: [{
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }],
        },
        plugins: options.mode === 'development' ? [] : [
            // See https://github.com/mlwilkerson/uglify-es-terser-92percent-repro/
            new MinifyPlugin()
        ],
        // Production : see https://github.com/webpack-contrib/babel-minify-webpack-plugin/issues/68
        devtool: options.mode === 'development' ? 'cheap-module-eval-source-map' : false
        // devtool: 'source-map'
    };
};
