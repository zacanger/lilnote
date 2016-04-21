#!/usr/bin/env node

'use strict'

const
  low  = require('lowdb')
, path = require('path')
, home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']

function write(notes, note){
  notes.push(note)
}

function show(notes){
  notes.each((note, index) => {
    console.log(' [' + (index + 1) + '] ' + note + '\n')
  })
}

function del(notes, noteIndex){
  if (!noteIndex) {
    return console.log('which note do you want to remove?')
  }
  notes.pullAt(noteIndex)
}

function lilnote(){
  let
    db    = low(home + '/.lilnote.json')
  , notes = db('notes')
  , arg   = process.argv[2]

  if (arg) {
    switch (arg) {
      case '-s':
        console.log('your notes:')
        show(notes)
        break
      case '-r':
        var noteIndex = process.argv[3] - 1
        del(notes, noteIndex)
        break
      case '-h':
        console.log('take a lil note!')
        console.log('lilnote [note]     write new [note]')
        console.log('lilnote [stdin]    write directly from stdin')
        console.log('lilnote -s         show all notes')
        console.log('lilnote -r [n]     delete note number [n]')
        console.log('lilnote -h         help message')
        break
      default:
        write(notes, arg)
    }
  } else {
    process.stdin.resume()
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', note => write(notes, note.trim()))
//    process.stdin.on('data', note => {
//      write(notes, note.trim())
//    })
  }
}

lilnote()

