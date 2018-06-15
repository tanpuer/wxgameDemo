document.createElementNS = function (ns, tagName) {
  return document.createElement(tagName)
}
GameGlobal.THREE = require('./three.js')