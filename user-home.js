const { homedir } = require('os')
const { env } = process
const userHome = env.HOME || env.HOMEPATH || env.USERPROFILE || homedir()
module.exports = userHome
