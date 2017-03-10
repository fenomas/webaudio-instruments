#!/bin/sh -x
set -e

SRC="https://raw.githubusercontent.com/g200kg/webaudio-tinysynth/master/webaudio-tinysynth.js"
OUT="webaudio-tinysynth.js"

curl $SRC -o $OUT


MOD="if (module) module.exports = WebAudioTinySynth"
MSG="// Original source: $SRC"

echo "\n\n$MOD\n$MSG\n" >> $OUT

