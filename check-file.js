#!/usr/bin/env node

const
  fs    = require('fs')
, home  = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']

try {
  fs.statSync(`${home}/.lilnote.json`)
} catch (e) {
  fs.writeFileSync(`${home}/.lilnote.json`, '[]')
}
