const { defineConfig } = require('@vue/cli-service')
const fs = require('fs')

module.exports = defineConfig({
  outputDir: 'docs',
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Surfboard-feedback/'
    : '/',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
        https: {
      key: fs.readFileSync('../key.pem'),
      cert: fs.readFileSync('../cert.pem'),
    }
  },

})
