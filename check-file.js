#!/usr/bin/env node

'use strict'

const { statSync, writeFileSync } = require('fs')
const { getUserHome } = require('zeelib')
const home = getUserHome()
const file = `${home}/.lilnote.json`

try {
  statSync(file)
} catch (e) {
  writeFileSync(file, '[]')
}
