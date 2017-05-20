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
    var instCt = instMax - instMin + 1
    var drumCt = drumMax - drumMin + 1
    var names = []
    for (var i = 0; i < instCt; i++) names.push(synth.getTimbreName(0, i + instMin))
    for (var j = 0; j < drumCt; j++) names.push(synth.getTimbreName(1, j + drumMin))




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

    this.play = function (inst, note, vel, delay, duration, channel, attack) {
        inst = inst || 0
        if (inst < 0 || inst > instMax + drumCt) throw 'Invalid instrument'
        note = note || 60
        delay = delay || 0
        if (isNaN(vel)) vel = 0.5
        if (isNaN(duration)) duration = 0.5
        if (delay < 0) delay = 0
        play_impl(inst, note, vel, delay, duration, channel, attack)
    }


    function play_impl(inst, note, vel, delay, duration, channel, attack) {
        var isDrums = (inst >= instCt)
        // use passed-in channel value, defaulting to 0
        channel = channel | 0
        if (isDrums) {
            // drums use channel 9, and determine instrument based on the note
            channel = 9
            note = inst + drumMin - instCt
        } else {
            inst -= instMin
            synth.setProgram(channel, inst)
        }
        // play the note
        var t = synth.actx.currentTime
        var intVel = (127 * vel) | 0

        // console.log([
        //     'playing: ch=', channel,
        //     '   inst=', inst,
        //     '   note=', note,
        //     '   intVel=', intVel,
        //     '   delay=', delay,
        // ].join(''))

        var prog = synth.program[synth.pg[channel]].p

        if (note > 127) {
            // assume note is a frequency in Hz if it's above 127
            overrideParameter(prog, 'f', note)
            overrideParameter(prog, 't', 0)
        }
        if (attack) overrideParameter(prog, 'a', attack)

        // actual play command
        synth.noteOn(channel, note, intVel, t + delay)
        synth.noteOff(channel, note, t + delay + duration)

        // undo overrides
        if (note > 127) {
            undoOverride(prog, 'f')
            undoOverride(prog, 't')
        }
        if (attack) undoOverride(prog, 'a')

    }





    // temporarily override a program's parameters, for *source* oscillators
    // e.g. override(0, 'f', 500) sets oscillator.f = 500 
    // for all (oscillator.g==0), and caches overriden values

    function overrideParameter(prog, param, value) {
        var cache = overridden[param] || [0, 0, 0, 0, 0]
        for (var i = 0; i < prog.length; i++) {
            var osc = prog[i]
            if (osc.g !== 0) continue
            cache[i] = osc[param]
            osc[param] = value
        }
        overridden[param] = cache
    }
    var overridden = {}

    // undoes previous
    function undoOverride(prog, param) {
        var cache = overridden[param]
        for (var i = 0; i < prog.length; i++) {
            var osc = prog[i]
            if (osc.g !== 0) continue
            osc[param] = cache[i]
        }
    }





}




