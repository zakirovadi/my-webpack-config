const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') /* плагин для компиляции html */
const {CleanWebpackPlugin} = require('clean-webpack-plugin') /* плагин удаление файлов предыдущей компиляции */
const CopyPlugin = require('copy-webpack-plugin') /* плагин для простого копирования файлов в dist */
const MiniCssExtractPlugin = require('mini-css-extract-plugin') /* плагин для компиляции стилей в отельную папку*/
const TerserWebpackPlugin = require("terser-webpack-plugin") /* плагин для оптимизации js */
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') /* плагин для оптимизации css */

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if(isProd){
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reload: true
            }
        },
        'css-loader'
    ]

    if(extra){
        loaders.push(extra)
    }

    return loaders
}

module.exports = {
    context: path.resolve(__dirname, 'src'), /* указание контекстной папки */
    mode: 'development',
    entry: {
        main: './index.js'
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),

        new CleanWebpackPlugin(),

        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),

        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ],
    module: {
        rules: [
            { 
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: cssLoaders('sass-loader')
              }
        ]
    }
}