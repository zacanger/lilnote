#!/usr/bin/env node

'use strict'

const { writeFileSync } = require('fs')
const { getUserHome, fileExists } = require('zeelib')
const home = getUserHome()
const file = `${home}/.lilnote.json`

if (!fileExists(file)) {
  writeFileSync(file, '[]')
}
