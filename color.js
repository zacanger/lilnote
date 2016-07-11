'use strict'

// color generation
// options:
// bold, italic, underline, inverse, white, grey, black
// blue, cyan, green, magenta, red, yellow

const util = require('util')

const colorize = (color, text) => {
  const codes = util.inspect.colors[color]
  return `\x1b[${codes[0]}m${text}\x1b[${codes[1]}m`
}

const colors = () => {
  let val = {}
  Object.keys(util.inspect.colors).forEach((color) => {
    val[color] = (text) => colorize(color, text)
  })
  return val
}

module.exports = colors()
