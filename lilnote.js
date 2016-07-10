#!/usr/bin/env node

// current problems: doesn't del at all
// obviously parsing 0 is a problem so what do we do about this

'use strict'

const
  fs    = require('fs')
, clrs  = require('coolors')
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
    console.log(clrs('note saved!', 'yellow'))
  })
}

const show = notes => {
  console.log(clrs('your notes:\n', 'blue'))
  notes.forEach(note => console.log(clrs(`${notes.indexOf(note) + 1}: ${note}`, 'cyan')))
}

const del = (notes, noteIndex) => {
  if (!noteIndex) {
    return console.log(clrs('which note do you want to remove?', 'red'))
  }
  if (typeof noteIndex !== 'number') {
    if (notes.includes(noteIndex)) {
      notes.splice(notes.indexOf(noteIndex), 1)
    }
  }
  notes.splice(noteIndex, 1)
  console.log(clrs(`note ${noteIndex} removed`, 'red'))
}

const help = () => {
  console.log(
    clrs(`
                    lilnote
            take a lil note!
`, 'magenta')
  , clrs(`
    usage:
    lilnote [note]     write new [note]
    lilnote -s         show all notes
    lilnote -r [n]     delete note number [n]
    lilnote -h         help message
`, 'yellow'
  )
  , clrs(`
    example:
    lilnote 'make waffles with ice cream'
    lilnote eat
    lilnote -r 1
`, 'blue')
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
