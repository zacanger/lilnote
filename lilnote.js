#!/usr/bin/env node

'use strict'

const
  low  = require('lowdb')
, clrs = require('coolors')
, home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
, sin  = process.stdin

const write = (notes, note) => notes.push(note)

const show = notes => {
  notes.each((note, index) => console.log(clrs(`${index + 1}: ${note}`, 'cyan')))
}

const del = (notes, noteIndex) => {
  if (!noteIndex) {
    return console.log(clrs('which note do you want to remove?', 'red'))
  }
  notes.pullAt(noteIndex)
}

const lilnote = () => {
  let
    db    = low(`${home}/.lilnote.json`, {storage : require('lowdb/file-sync')})
  , notes = db('notes')
  , arg   = process.argv[2]

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
        console.log(clrs(`
              take a lil note!`, 'magenta'))
        console.log(clrs(`
    lilnote [note]     write new [note]
    lilnote [stdin]    write directly from stdin
    lilnote -s         show all notes
    lilnote -r [n]     delete note number [n]
    lilnote -h         help message
`, 'yellow'))
        break
      default:
        write(notes, arg)
    }
  } else {
    sin.resume()
    sin.setEncoding('utf8')
    sin.on('data', note => write(notes, note.trim()))
  }
}

lilnote()
