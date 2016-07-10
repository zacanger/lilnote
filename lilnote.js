#!/usr/bin/env node

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
  notes.forEach(note => console.log(clrs(note, 'cyan')))
}

const del = (notes, noteIndex) => {
  if (!noteIndex) {
    return console.log(clrs('which note do you want to remove?', 'red'))
  }
  notes.splice(noteIndex, 1)
  console.log(clrs('note removed', 'red'))
}

const help = () => {
  console.log(
    clrs(`
                    lilnote
            take a lil note!`, 'magenta')
  , clrs(`
    usage:
    lilnote [note]     write new [note]
    lilnote -s         show all notes
    lilnote -r [n]     delete note number [n]
    lilnote -h         help message
`, 'yellow')
  , clrs(`
    example:
    lilnote 'make waffles with ice cream'
    lilnote eat
    lilnote -r 1
`, 'blue'))

}
const lilnote = () => {
  if (arg) {
    switch (arg) {
      case '-s':
        console.log(clrs('your notes:', 'blue'))
        show(notes)
        break
      case '-r':
        let noteIndex = process.argv[3] - 1
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
