#!/usr/bin/env node

'use strict'

const {
  statSync
, writeFileSync
} = require('fs')
, home = require('./user-home')
, file = `${home}/.lilnote.json`

try {
  statSync(file)
} catch (e) {
  writeFileSync(file, '[]')
}
