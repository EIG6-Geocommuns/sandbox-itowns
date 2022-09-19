const path = require("path");

let config = {
    entry: {
        bundle: [
            './src/index.js',
        ]
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, './public/libs'),
        filename: '[name].js',
        library: '[name]',
    },
    devServer: {
        devMiddleware: {
            publicPath:  path.resolve(__dirname, './public'),
            writeToDisk: true,
        },
        static: path.resolve(__dirname, './public'),
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
        hot: false,
        // historyApiFallback: true,
        // open: true,
    },
    resolve: {
        fallback: {
            "buffer": require.resolve("buffer")
        }
    }
}

function buildConfig(env) {
    config.mode = (env === 'development' || env === 'production') ? env : 'development';
    return config;
}

module.exports = buildConfig;
