#!/usr/bin/env node

// current problems: doesn't del at all
// obviously parsing 0 is a problem so what do we do about this

'use strict'

const
  fs    = require('fs')
, clr   = require('./color')
, home  = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
, sin   = process.stdin
, arg   = process.argv[2]
, loc   = `${home}/.lilnote.json`
, file  = fs.readFileSync(loc)
, notes = JSON.parse(file)

const write = (notes, note) => {
  notes.push(note)
  const taken = JSON.stringify(notes, null, 2)
  fs.writeFile(loc, taken, 'utf8', err => {
    if (err) {
      return console.error('please report this error!', err)
    }
    console.log(clr.yellow('note saved!'))
  })
}

const show = notes => {
  console.log(clr.blue('your notes:\n'))
  notes.forEach(note => console.log(clr.cyan(`${notes.indexOf(note) + 1}: ${note}`)))
}

const del = (notes, noteIndex) => {
  const nope = () => console.log(clr.red('which note do you want to remove?'))
  if (!noteIndex) {
    return nope()
  }
  if (typeof noteIndex === 'string') {
    if (notes.includes(noteIndex)) {
      notes.splice(notes.indexOf(noteIndex), 1)
    }
  }
  if (typeof noteIndex === 'number') {
    notes.splice(noteIndex, 1)
    console.log(clr.red(`note ${noteIndex} removed`))
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
    lilnote [note]     write new [note]
    lilnote -s         show all notes
    lilnote -r [n]     delete note number [n]
    lilnote -h         help message
`)
  , clr.blue(`
    example:
    lilnote 'make waffles with ice cream'
    lilnote eat
    lilnote -r 1
`)
  )
}

const lilnote = () => {
  if (arg) {
    switch (arg) {
      case '-s':
        show(notes)
        break
      case '-r':
        const noteIndex = process.argv[3] - 1
        del(notes, noteIndex)
        break
      case '-h':
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
