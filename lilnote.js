#!/usr/bin/env node

const { writeFile, readFileSync } = require('fs')
const { getUserHome, colorize } = require('zeelib')
const c = colorize
const home = getUserHome()
const log = console.log
const arg = process.argv[2]
const loc = `${home}/.lilnote.json`
const file = readFileSync(loc)
const notes = JSON.parse(file)
const pkg = require('./package.json')
const vers = () => log(c.green(`lilnote version ${pkg.version}`))
const help = () =>
  log(
    c.bold(
      c.magenta(`
                    lilnote
            take a lil note!
`)
    ),
    c.yellow(`
  usage:
    lilnote note    write new note
    lilnote -s      show all notes
    lilnote -r n    delete note number n
    lilnote -h      this help message
    lilnote -v      show lilnote version
`),
    c.blue(`
  example:
    lilnote 'make waffles with ice cream'
    lilnote eat
    lilnote -r 1
`)
  )

// write file
const save = () => {
  const taken = JSON.stringify(notes, null, 2)
  writeFile(loc, taken, 'utf8', (err) => {
    if (err) {
      return console.error('please report this error!', err)
    }
  })
}

// add note
const write = (notes, note) => {
  notes.push(note)
  save()
  return log(c.yellow('note saved!'))
}

// list notes
const show = (notes) => {
  log(c.blue(c.underline('your notes:\n')))
  notes.forEach((note) => log(c.cyan(`${notes.indexOf(note) + 1}: ${note}`)))
}

// remove note
const del = (notes, noteIndex) => {
  const nope = () => log(c.italic(c.red('which note do you want to remove?')))

  const done = () => log(c.red(`note ${noteIndex} removed`))

  if (!noteIndex) {
    return nope()
  }

  if (typeof noteIndex === 'string' && notes.includes(noteIndex)) {
    notes.splice(notes.indexOf(noteIndex), 1)
    save()
    return done()
  }

  if (parseInt(noteIndex, 10) !== 'NaN') {
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
        return show(notes)
      case '-r':
      case '--remove':
        return del(notes, process.argv[3])
      case '-h':
      case '--help':
        return help()
      case '-v':
      case '--version':
        return vers()
      default:
        write(notes, arg)
    }
  } else {
    help()
  }
}

// don't run if we're being imported
if (module.parent) {
  log('Please install lilnote globally: `npm i -g lilnote`.')
} else {
  lilnote()
}
