#!/usr/bin/env node

'use strict'

const { writeFileSync } = require('fs')
const { getUserHome, checkForFile } = require('zeelib')
const home = getUserHome()
const file = `${home}/.lilnote.json`

if (!checkForFile(file)) {
  writeFileSync(file, '[]')
}
