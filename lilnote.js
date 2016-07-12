#!/usr/bin/env node

'use strict'

const
  fs    = require('fs')
, clr   = require('./color')
, home  = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
// if the above doesn't work on windows, try this:
// , home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
, sin   = process.stdin
, arg   = process.argv[2]
, loc   = `${home}/.lilnote.json`
, file  = fs.readFileSync(loc)
, notes = JSON.parse(file)

const save = () => {
  const taken = JSON.stringify(notes, null, 2)
  fs.writeFile(loc, taken, 'utf8', err => {
    if (err) {
      return console.error('please report this error!', err)
    }
  })
}

const write = (notes, note) => {
  notes.push(note)
  save()
  return console.log(clr.yellow('note saved!'))
}

const show = notes => {
  console.log(clr.blue(clr.underline('your notes:\n')))
  notes.forEach(note => console.log(clr.cyan(`${notes.indexOf(note) + 1}: ${note}`)))
}

const del = (notes, noteIndex) => {
  const nope = () => console.log(clr.italic(clr.red('which note do you want to remove?')))
  const done = () => console.log(clr.red(`note ${noteIndex} removed`))

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
  else {
    return nope()
  }
}

const help = () => {
  console.log(
    clr.bold(clr.magenta(`
                    lilnote
            take a lil note!
`))
  , clr.yellow(`
  usage:
    lilnote note    write new note
    lilnote -s      show all notes
    lilnote -r n    delete note number n
    lilnote -h      this help message
`)
  , clr.blue(`
  example:
    lilnote 'make waffles with ice cream'
    lilnote eat
    lilnote -r 1
`))
}

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
      default:
        write(notes, arg)
    }
  } else {
    help()
  }
}

lilnote()
