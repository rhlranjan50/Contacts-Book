// Webpack uses this to work with directories
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const isDevMode = process.env.APP_ENV === "development";

const outputJsFileName = isDevMode ? '[name].[hash].js' : '[name].[contenthash].js';
const outputCSSFileName = isDevMode ? 'bundle.[hash].css' : 'bundle.[contenthash].css';

// This is main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = {

    // Path to your entry point. From this file Webpack will begin his work
    entry: {
        app: './src/index.js'
    },

    // Path and filename of your result bundle.
    // Webpack will bundle all JavaScript into this file
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: outputJsFileName
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]src[\\/]js[\\/]vendor[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        },
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        hot: true
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                // Apply rule for .sass, .scss or .css files
                test: /\.(sa|sc|c)ss$/,

                // Set loaders to transform files.
                // Loaders are applying from right to left(!)
                // The first loader will be applied after others
                use: [
                        {
                            loader: isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader
                        },
                        // {
                        //     // After all CSS loaders we use plugin to do his work.
                        //     // It gets all transformed CSS and extracts it into separate
                        //     // single bundled file
                        //     loader: MiniCssExtractPlugin.loader
                        // }, 
                        {
                            // This loader resolves url() and @imports inside CSS
                            loader: "css-loader",
                        },
                        {
                            // Then we apply postCSS fixes like autoprefixer and minifying
                            loader: "postcss-loader"
                        },
                        {
                            // First we transform SASS to standard CSS
                            loader: "sass-loader",
                            options: {
                                implementation: require("sass")
                            }
                        }
                ]
            },
            {
                // Now we apply rule for images
                test: /\.(png|jpe?g|gif|svg|ico)$/,
                use: [
                        {
                            // Using file-loader for these files
                            loader: "file-loader",

                            // In options we can set different things like format
                            // and directory to save
                            options: {
                                outputPath: 'images'
                            }
                        }
                ]
            },
            { test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }  
        ]  
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: outputCSSFileName
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'My App',
            template: 'src/index.html',
            meta: {
                'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            ko: "knockout"
        })
    ],

    // Default mode for Webpack is production.
    // Depending on mode Webpack will apply different things
    // on final bundle. For now we don't need production's JavaScript 
    // minifying and other thing so let's set mode to development
    mode: 'development'
};
