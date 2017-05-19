
## webaudio-instruments

This is a simple wrapper for a subset of the functionality in 
[webaudio-tinysynth](https://github.com/g200kg/webaudio-tinysynth). 
It lets you play tones from MIDI-like instruments, but without any sound fonts
or audio files - the tones are generated purely from WebAudio oscillators.

> [Live demo](https://andyhall.github.io/webaudio-instruments/)

### Installation:

```sh
npm install --save webaudio-instruments
```

### Usage

```js
var Instruments = require('webaudio-instruments')
var player = new Instruments()

player.play(
    24,        // instrument: 24 is "Acoustic Guitar (nylon)"
    72,        // note: midi number or frequency in Hz (if > 127)
    0.5,       // velocity: 0..1
    0,         // delay in seconds
    0.5,       // duration in seconds
    0,         // (optional - specify channel for tinysynth to use)
    0.05       // (optional - override envelope "attack" parameter)
)
```

### API

 * `var player = new Instruments(audioContext, destinationNode)`  
    Both parameters are optional.
 * `player.names`  
    Array of instrument names
 * `player.play(inst, note, vel, delay, duration, channel, attack)`  
    See above. Note that instruments numbers over 127 are percussion, 
    so the `note` parameter is ignored. `channel`, `attack` params are optional.
 * `player.getCurrentTime()`  
    Time value (from the audio context)
 * `player.setQuality(q)`  
    Set the quality to `1` (high) or `0` (low). Low version uses fewer oscillators,
    see original repo for details.
 * `player._synth`  
    For anything else, access the underlying [tinysynth](https://github.com/g200kg/webaudio-tinysynth).

### Credit

All the interesting magic here (the implementation of MIDI instruments using
webaudio oscillators) is from 
[webaudio-tinysynth](https://github.com/g200kg/webaudio-tinysynth)!
See that repo for further info and more features.

All I've done is to abstract away the MIDI-related stuff, 
add CommonJS support, etc.

My additions here are MIT license. Original source is Apache 2.0.
