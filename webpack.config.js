const path = require('path');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    if(isProd) {
        config.minimizer = [
            new OptimizeCssAssetPlugin(),
            new TerserWebpackPlugin()
        ]
    }
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.js'],
        // analytics: './analytics.js'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@models': path.resolve(__dirname, 'src/assets/models'),
            '@assets': path.resolve(__dirname, 'src/assets'),
        }
    },
    optimization: optimization(),

    devServer: {
        port: 4200,
        hot: isDev
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd,
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'src/assets/ico'),
            to: path.resolve(__dirname, 'dist')
        },
        // {
        //     from: path.resolve(__dirname, 'src/assets/models/optimized/'),
        //     to: path.resolve(__dirname, 'dist')
        // }
    ]),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
    ],
    module: {
        rules: [{
                test: /\.css$/i,
                use: [
                    {
                    loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true
                        },
                    }, 
                    'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|gif|bin|hdr)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eof)$/,
                use: ['file-loader']
            },
            {
                test: /\.(gltf|glb)$/,
                use: ['file-loader'],
            },
            {
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ]
                    }
                }
            }
        ],
    }
}