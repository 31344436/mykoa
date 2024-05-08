import { resolve as _resolve, join } from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
export const target = "node";
export const mode = "production";   //"development" ; production
export const entry = "./src/app.ts";
 
export const output = {
    path: _resolve(__dirname, 'dist'),
    filename: 'app.js'
};
export const resolve = {
    extensions: ['.ts', '.tsx', '.js']
};
export const module = {
    rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }
    ] 
};
export const plugins = [
        new CleanWebpackPlugin()//,
        //new HtmlWebpackPlugin()
];
/*
export const devServer = {
    contentBase: join(__dirname, 'dist'),
    compress: true,
    historyApiFallback: true,
    hot: true,
};*/