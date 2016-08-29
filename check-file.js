#!/usr/bin/env node

'use strict'

const {
  statSync
, writeFileSync
} = require('fs')
, home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
, file = `${home}/.lilnote.json`

try {
  statSync(file)
} catch (e) {
  writeFileSync(file, '[]')
}
