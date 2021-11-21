'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://127.0.0.1:8001"',
  OSS_PATH: '"https://mypractice1024-1.oss-cn-beijing.aliyuncs.com"'
})
