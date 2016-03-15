#!/usr/bin/env node

'use strict'

const
  tmpEditor = require('tmp-editor')
, low       = require('lowdb')
, userHome  = require('user-home')

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
    db         = low(userHome + '/.lilnote.json')
  , notes      = db('notes')
  , flagOrNote = process.argv[2]

  if(flagOrNote){
    switch(flagOrNote){
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
      case '-e':
      case '--edit':
        tmpEditor().then((note) => {
          addNote(notes, note)
        }).catch(console.error)
        break
      case '-h':
      case '--help':
        console.log('take a lil note!')
        console.log('lilnote [note]            writes new [note]')
        console.log('lilnote [stdin]           writes directly from stdin')
        console.log('lilnote -s --show         show all notes')
        console.log('lilnote -e --edit         add and edit new note with $EDITOR')
        console.log('lilnote -r --remove [n]   delete note number [n]')
        console.log('lilnote -h --help         this help message')
        break
      default:
        addNote(notes, flagOrNote)
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
