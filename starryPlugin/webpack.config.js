var webpack = require('webpack');
var path = require('path');
const tsImportPluginFactory = require('ts-import-plugin')

module.exports = {
	entry: {
		index: './index.tsx'
	},
	output: {
		path: path.join(__dirname, './build'),
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss']
    },
	module: {
		rules: [
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            getCustomTransformers: () => ({
                                before: [tsImportPluginFactory({
                                    libraryName: 'antd',
                                    libraryDirectory: 'lib',
                                    style: true
                                })]
                            }),
                            compilerOptions: {
                                "module": "es2015"
                            }
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader?sourceMap&outputStyle=expanded'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },
	target: 'electron'
}