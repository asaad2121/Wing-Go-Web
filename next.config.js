/** @type {import('next').NextConfig} */
require('dotenv').config();
const webpack = require('webpack');
const path = require('path');

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    webpack: (config, { isServer, buildId, dev }) => {
        // Fixes npm packages that depend on `fs` module
        if (!isServer) {
            config.resolve.fallback.fs = false;
        }
        /**
         * Returns environment variables as an object
         */
        const env = Object.keys(process.env)
            .filter((key) => !key.includes('NEXT_'))
            .reduce((acc, curr) => {
                acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
                return acc;
            }, {});

        /** Allows you to create global constants which can be configured
         * at compile time, which in our case is our environment variables
         */
        config.plugins.push(new webpack.DefinePlugin(env));

        // Allows you to create global constants which can be configured at compile time, which in our case is our environment variables
        config.plugins.push(new webpack.DefinePlugin(JSON.stringify(env)));

        // Required to prevent "React is not defined" error
        config.plugins.push(
            new webpack.ProvidePlugin({
                React: 'react',
            })
        );

        return config;
    },
};

module.exports = nextConfig;
