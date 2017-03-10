'use strict'

var Synth = require('./webaudio-tinysynth')

module.exports = Player


function Player(audioContext, destination) {


    // params
    var instMin = 0
    var instMax = 127
    var drumMin = 35
    var drumMax = 81



    // internals
    var synth = new Synth({
        useReverb: 1,
        quality: 1,
        voices: 32,
    })

    if (audioContext) {
        synth.setAudioContext(audioContext, destination)
    }



    // merge instruments and drums into one big list
    var instCt = instMax - instMin
    var drumCt = drumMax - drumMin
    var names = []
    for (var i = 0; i <= instCt; i++) names.push(synth.getTimbreName(0, i + instMin))
    for (var j = 0; j <= drumCt; j++) names.push(synth.getTimbreName(1, j + drumMin))




    // Properties
    this._synth = synth
    this.names = names




    // API

    this.setQuality = function (q) {
        synth.setQuality(q ? 1 : 0)
    }

    this.getCurrentTime = function () {
        return synth.actx.currentTime
    }

    this.play = function (inst, note, vel, delay, duration) {
        inst = inst || 0
        if (inst < 0 || inst > drumCt + instCt) throw 'Invalid instrument'
        note = note || 60
        delay = delay || 0
        if (isNaN(vel)) vel = 0.5
        if (isNaN(duration)) duration = 0.5
        if (delay < 0) delay = 0
        play_impl(inst, note, vel, delay, duration)
    }


    function play_impl(inst, note, vel, delay, duration) {
        var isDrums = (inst > instCt)
        // may someday need to choose channels more cleverly
        // for now, always 0 for instruments, 9 for drums
        var channel
        if (isDrums) {
            // drums use channel 9, and determine instrument based on the note
            channel = 9
            note = inst + drumMin - instCt
        } else {
            channel = 0
            inst -= instMin
            synth.setProgram(channel, inst)
        }
        // play the note
        var t = synth.getAudioContext().currentTime
        var intVel = (127 * vel) | 0

        // console.log([
        //     'playing: ch=', channel,
        //     '   inst=', inst,
        //     '   note=', note,
        //     '   intVel=', intVel,
        //     '   delay=', delay,
        // ].join(''))

        // assume note is a frequency if it's above 127
        if (note > 127) setFreq(channel, note)
        synth.noteOn(channel, note, intVel, t + delay)
        synth.noteOff(channel, note, t + delay + duration)
        if (note > 127) unsetFreq(channel)
    }





    function setFreq(channel, freq) {
        var prog = synth.program[synth.pg[channel]].p
        prog.forEach(function (osc, i) {
            if (osc.g !== 0) return
            prevF[i] = osc.f
            prevT[i] = osc.t
            osc.f = freq
            osc.t = 0
        })
    }

    function unsetFreq(channel) {
        var prog = synth.program[synth.pg[channel]].p
        prog.forEach(function (osc, i) {
            if (osc.g !== 0) return
            osc.f = prevF[i]
            osc.t = prevT[i]
        })
    }
    var prevF = []
    var prevT = []


}




