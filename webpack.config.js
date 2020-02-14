const path = require('path');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const fs = require( "fs" );
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

var tmpltextjs = "";

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

///////////////////////////////////////////////////////////////////////////////////////

const cssRex = /<!--bundled-css-->[\s\S]*?<!--\/bundled-css-->/mgi;
const jsRex = /<!--bundled-js-->[\s\S]*?<!--\/bundled-js-->/mgi;

function templateProcessor () {
    let files = HTMLWebpackPlugin.files;
    let options = HTMLWebpackPlugin.options;

    let js = ``;
    
    for (let j = 0; j < files.js.length; j++) {
        let jsPath = files.js[j];
        js += 
    `<div class="canvasjs">
        <script type="text/javascript" src="${jsPath}"></script>
    </div>`;
    }

    let tmpl = options.inplaceTemplate;

    let finPath = path.resolve(__dirname, tmpl);
    let fin = fs.readFileSync(finPath, 'utf8');

    // fin = fin.replace(cssRex, css).replace(jsRex, js);
    fin = fin.replace(jsRex, js);
    return fin;
};

///////////////////////////////////////////////////////////////////////////////////////

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    if (isProd) {
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
        // index: 'index.html',
        // analytics: './analytics.js'
    },
    
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        pathinfo: isDev,
    },

    resolve: {
        extensions: ['.js', '.html', 'css'],
        alias: {
            '@models': path.resolve(__dirname, 'src/assets/models'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            // '@src': path.resolve(__dirname, 'src/'),
        },
    },

    optimization: optimization(),

    devServer: {
        port: 4200,
        hot: isDev,
    },



    plugins: [
        new HTMLWebpackPlugin({
            // template: './index.html',
            minify: {
                collapseWhitespace: isProd,
            },
            xhtml: isProd,
            inject: false,
            alwaysWriteToDisk: true,

			filename: path.resolve(__dirname, 'dist/index.html'),
			inplaceTemplate: path.resolve(__dirname, 'src/index.html'),
            // templateContent: templateProcessor,
            templateContent: templateProcessor,

            
        }),

        new HTMLWebpackPlugin( {
            template: './index.html',
			chunks: "all",
			alwaysWriteToDisk: true,
			filename: path.resolve(__dirname, 'dist/index.html'),
			inplaceTemplate: path.resolve(__dirname, 'dist/index.html'),
			templateContent: templateProcessor,
			chunkSortMode: "dependency",
            hash: true,
            inject: true,
            xhtml: isProd,
            pathinfo: isDev,
		} ),

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
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true
                        },
                    },
                    'css-loader'
                ],
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