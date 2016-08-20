#!/usr/bin/env node

'use strict'

const
  fs    = require('fs')
, clr   = require('./color')
, home  = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
// , home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
, log   = console.log
, arg   = process.argv[2]
, loc   = `${home}/.lilnote.json`
, file  = fs.readFileSync(loc)
, notes = JSON.parse(file)
, pkg   = require('./package.json')
, vers  = () => log(`\x1b[33mlilnote version ${pkg.version}\x1b[0m`)
, help  = () => log(
    clr.bold(clr.magenta(`
                    lilnote
            take a lil note!
`)) , clr.yellow(`
  usage:
    lilnote note    write new note
    lilnote -s      show all notes
    lilnote -r n    delete note number n
    lilnote -h      this help message
    lilnote -v      show lilnote version
`)  , clr.blue(`
  example:
    lilnote 'make waffles with ice cream'
    lilnote eat
    lilnote -r 1
`))

// write file
const save = () => {
  const taken = JSON.stringify(notes, null, 2)
  fs.writeFile(loc, taken, 'utf8', err => {
    if (err) {
      return console.error('please report this error!', err)
    }
  })
}

// add note
const write = (notes, note) => {
  notes.push(note)
  save()
  return log(clr.yellow('note saved!'))
}

// list notes
const show = notes => {
  log(clr.blue(clr.underline('your notes:\n')))
  notes.forEach(note => log(clr.cyan(`${notes.indexOf(note) + 1}: ${note}`)))
}

// remove note
const del = (notes, noteIndex) => {
  const
    nope = () => log(clr.italic(clr.red('which note do you want to remove?')))
  , done = () => log(clr.red(`note ${noteIndex} removed`))

  if (!noteIndex) {
    return nope()
  }

  if (typeof noteIndex === 'string' && notes.indexOf(noteIndex) !== -1) {
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
        show(notes)
        break
      case '-r':
      case '--remove':
        const noteIndex = process.argv[3]
        del(notes, noteIndex)
        break
      case '-h':
      case '--help':
        help()
        break
      case '-v':
      case '--version':
        vers()
        break
      default:
        write(notes, arg)
    }
  } else {
    help()
  }
}

lilnote()
