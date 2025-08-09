const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    target: 'node',
    mode: isProduction ? 'production' : 'development',
    entry: './src/extension/index.ts',
    output: {
      path: path.resolve(__dirname, 'out'),
      filename: 'extension.js',
      libraryTarget: 'commonjs2',
      devtoolModuleFilenameTemplate: '../[resource-path]'
    },
    devtool: isProduction ? 'source-map' : 'nosources-source-map',
    externals: {
      vscode: 'commonjs vscode',
      // External dependencies that shouldn't be bundled
      'ws': 'commonjs ws',
      'mime-types': 'commonjs mime-types',
      'open': 'commonjs open'
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@core': path.resolve(__dirname, 'src/core'),
        '@extension': path.resolve(__dirname, 'src/extension')
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(__dirname, 'tsconfig.json'),
                compilerOptions: {
                  module: 'es2020', // Enable tree shaking
                  moduleResolution: 'node'
                }
              }
            }
          ]
        }
      ]
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
            compress: {
              drop_console: isProduction,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info'],
              passes: 2
            },
            mangle: {
              reserved: ['LiveServerPlusPlus'] // Preserve important class names
            }
          },
          extractComments: false,
        })
      ],
      sideEffects: false, // Enable tree shaking
      usedExports: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          core: {
            name: 'core',
            test: /[\\/]src[\\/]core[\\/]/,
            priority: 10,
            reuseExistingChunk: true
          },
          utils: {
            name: 'utils',
            test: /[\\/]src[\\/].*[\\/]utils[\\/]/,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      }
    },
    plugins: [
      new CleanWebpackPlugin(),
    ],
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 250000,
      maxAssetSize: 250000
    },
    stats: {
      errorDetails: true,
      warningsFilter: [/Failed to parse source map/]
    }
  };
};