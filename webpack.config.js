const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'public/build');
const APP_DIR = path.resolve(__dirname, 'views');
const CONFIG_PATH = process.env.CONFIG_PATH || path.resolve(__dirname, './config/pluginbot.config.js');
const PLUGIN_DIR = path.resolve(__dirname, "./plugins");

const config = async function () {
    const configBuilder = require("pluginbot/config");
    const pluginConfigs = await configBuilder.buildClientConfig(CONFIG_PATH);
    const pluginMap = await configBuilder.buildClientPluginMap(CONFIG_PATH);
    const entryMap = Object.entries(pluginMap).reduce((acc, [key, value]) => {
        acc[`plugins/${key}`] = value;
        return acc;
    }, {});
    const plugins =
        {
            entry: {
                "vendor" : ["react-router", "redux", "react", "react-redux", "redux-form", "servicebot-base-form", "redux-form-validators"],
                ...entryMap,
                "bundle" : ['react-hot-loader/patch', `${APP_DIR  }/index.jsx`],


            },
            output: {
                path: BUILD_DIR,
                publicPath: "/build/",
                filename: '[name].js',
                library: ["_plugins", "[name]"],
            },

            module: {
                loaders: [
                    {
                        test: /\.jsx?/,
                        loader: 'babel-loader',
                        include: [PLUGIN_DIR, APP_DIR],


                    },
                    {
                        test: /\.css$/,
                        loader: "style-loader!css-loader"
                    },
                    {
                        test: /js[\/\\].+\.(jsx|js)$/,
                        loader: 'imports-loader?jQuery=jquery,$=jquery,this=>window'
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            "style-loader", // creates style nodes from JS strings
                            "css-loader", // translates CSS into CommonJS
                            "sass-loader" // compiles Sass to CSS
                        ]
                    }

                ]
            },
            devServer: {
                historyApiFallback: true,
                hot: true,
                contentBase: path.resolve(__dirname, 'public'),
                inline: true,
                host: 'localhost', // Defaults to `localhost`
                port: 3002,
                proxy: {
                    '/' : {
                        target: 'http://localhost:3000',
                        secure: false
                    },
                    '^/api/**': {
                        target: 'http://localhost:3000',
                        secure: false
                    },
                    '^/setup': {
                        target: 'http://localhost:3000',
                        secure: false
                    },
                }
            },
            externals: {
                pluginbot_client_config: JSON.stringify(pluginConfigs),
                _plugins: "_plugins",
            },

            plugins: [
                new webpack.HotModuleReplacementPlugin(),
                new webpack.optimize.CommonsChunkPlugin({
                    name: "vendor",
                    // filename: "vendor.js"
                    // (Give the chunk a different name)

                    minChunks: Infinity,
                    // (with more entries, this ensures that no other module
                    //  goes into the vendor chunk)
                }),


                // new UglifyJsPlugin(),
                // new webpack.DefinePlugin({
                //     'process.env': {
                //         NODE_ENV: JSON.stringify('production')
                //     }
                // })


            ]
        };
    return [ plugins]
};


module.exports = config;
