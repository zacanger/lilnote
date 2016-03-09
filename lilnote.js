#!/usr/bin/env node

'use strict'

const
  tmpEditor = require('tmp-editor')
, low       = require('lowdb')
, userHome  = require('user-home')
, mkdirp    = require('mkdirp')
, lilDir    = userHome + '/.lilnote'

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
    db         = low(lilDir + '/db.json')
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
        console.log('lilnote [note]         writes that new [note]')
        console.log('lilnote [stdin]        writes it directly from stdin')
        console.log('lilnote -s             show all your lil notes')
        console.log('lilnote -e             add and edit a new note with your editor')
        console.log('lilnote -r [note]      bye bye, lilnote number [note]')
        console.log('lilnote -h             i think you just did this one!')
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

mkdirp(lilDir, (error) => {
  if(error){
    console.error('ERROR: lilnote failed somewhere!\n', error)
  }
  main()
})

