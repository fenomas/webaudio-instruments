'use strict'

var Player = require('..')


var player = new Player()
window.p = player
window.s = player._synth



// program number and pulldown menu
var currInst = 0
var pulldown = document.getElementById('instrument')
var optsHTML = ''
player.names.forEach(function (name, i) {
    optsHTML += ['<option value="', i, '">', name, '</option>\n'].join('')
})
pulldown.innerHTML = optsHTML
pulldown.onchange = function () {
    currInst = pulldown.selectedIndex
}




// quality
document.getElementById('quality').onchange = (function (e) {
    var i = e.target.selectedIndex
    var q = (i === 0) ? 1 : 0
    player.setQuality(q)
})




// play buttons

document.getElementById('play').onmousedown = function () {
    // play midi note 69
    player.play(currInst, 69, 0.5, 0, 0.5)
}

document.getElementById('playChord').onmousedown = function () {
    // play by frequency
    var f = 440
    player.play(currInst, f, 0.5, 0, 0.5)
    player.play(currInst, f * 3 / 2, 0.5, 0, 0.5)
    player.play(currInst, f * 5 / 4, 0.5, 0, 0.5)
    // player.play(currInst, f * 7 / 4, 0.5, 0, 0.5)
}




