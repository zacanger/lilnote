#!/usr/bin/env node

'use strict'

const
  low       = require('lowdb')
, path      = require('path')
, home      = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']

function addNote(notes, note){
  notes.push(note)
}

function printNotes(notes){
  notes.each((note, index) => {
    console.log(' [' + (index + 1) + '] ' + note + '\n')
  })
}

function removeNote(notes, noteIndex){
  if(!noteIndex){
    return console.log('but which one?')
  }
  notes.pullAt(noteIndex)
}

function main(){
  let
    db    = low(home + '/.lilnote.json')
  , notes = db('notes')
  , arg   = process.argv[2]

  if(arg){
    switch(arg){
      case '-s':
      case '--show':
        console.log('your notes:')
        printNotes(notes)
        break
      case '-r':
      case '--remove':
        var noteIndex = process.argv[3] - 1
        removeNote(notes, noteIndex)
        break
      case '-h':
      case '--help':
        console.log('take a lil note!')
        console.log('lilnote [note]     write new [note]')
        console.log('lilnote [stdin]    write directly from stdin')
        console.log('lilnote -s         show all notes')
        console.log('lilnote -r [n]     delete note number [n]')
        console.log('lilnote -h         help message')
        break
      default:
        addNote(notes, arg)
    }
  } else {
    process.stdin.resume()
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (note) => {
      addNote(notes, note.trim())
    })
  }
}

main()
