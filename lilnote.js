#!/usr/bin/env node

'use strict'

const {
  writeFile
, readFileSync
}       = require('fs')
, {
  bold
, blue
, cyan
, green
, italic
, magenta
, red
, underline
, yellow
}       = require('./color')
, home  = require('./user-home')
, log   = console.log
, arg   = process.argv[2]
, loc   = `${home}/.lilnote.json`
, file  = readFileSync(loc)
, notes = JSON.parse(file)
, pkg   = require('./package.json')
, vers  = () => log(green(`lilnote version ${pkg.version}`))
, help  = () => log(
    bold(magenta(`
                    lilnote
            take a lil note!
`)), yellow(`
  usage:
    lilnote note    write new note
    lilnote -s      show all notes
    lilnote -r n    delete note number n
    lilnote -h      this help message
    lilnote -v      show lilnote version
`), blue(`
  example:
    lilnote 'make waffles with ice cream'
    lilnote eat
    lilnote -r 1
`))

// write file
const save = () => {
  const taken = JSON.stringify(notes, null, 2)
  writeFile(loc, taken, 'utf8', err => {
    if (err) {
      return console.error('please report this error!', err)
    }
  })
}

// add note
const write = (notes, note) => {
  notes.push(note)
  save()
  return log(yellow('note saved!'))
}

// list notes
const show = notes => {
  log(blue(underline('your notes:\n')))
  notes.forEach(note => log(cyan(`${notes.indexOf(note) + 1}: ${note}`)))
}

// remove note
const del = (notes, noteIndex) => {
  const
    nope = () => log(italic(red('which note do you want to remove?')))
  , done = () => log(red(`note ${noteIndex} removed`))

  if (!noteIndex) {
    return nope()
  }

  if (typeof noteIndex === 'string' && notes.includes(noteIndex)) {
    notes.splice(notes.indexOf(noteIndex), 1)
    save()
    return done()
  }

  if (parseInt(noteIndex) !== 'NaN') {
    notes.splice(noteIndex - 1, 1)
    save()
    return done()
  }

  return nope()
}

// handle args
const lilnote = () => {
  if (arg) {
    switch (arg) {
      case '-s':
      case '--show':
        return show(notes)
      case '-r':
      case '--remove':
        const noteIndex = process.argv[3]
        return del(notes, noteIndex)
      case '-h':
      case '--help':
        return help()
      case '-v':
      case '--version':
        return vers()
      default:
        write(notes, arg)
    }
  } else {
    help()
  }
}

// don't run if we're being imported
if (module.parent) {
  console.log('Please install lilnote globally: `npm i -g lilnote`.')
} else {
  lilnote()
}
