import * as sc from './sc.js'
import { mode } from './mode.js'
import { rand, exprand, choose, whoose } from './random.js'
import { Brown } from './brown.js'
import { Sample } from './sample.js'
import { PlaySample }  from './synth.js'
import { Trig, TDiv, Changed } from './trig.js'

// global scope for graph creation
window.seed = Date.now() // or overwrite
window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.audio = null
window.bus = null
window.verb = null
window.master = null
window.sample = null
window.wavetable = null
window.soundscape = null

const playButton = document.getElementById('play')
const sldrVolume = document.getElementById('volume')
const sldrSpeed = document.getElementById('speed')
const sldrMood = document.getElementById('mood')
sldrVolume.value = 0.85
sldrSpeed.value = 0.4
sldrMood.value = 0.5
sldrVolume.oninput = function() {
  master.gain.value = sc.dbamp(sc.linlin(this.value, 0,1, -30,6))
}
sldrSpeed.oninput = function() {
  interval = sc.linexp(this.value, 0,1, 1.5,0.15)
  overlap = sc.linexp(this.value, 0,1, 1.5,0.4)
  maxwait = sc.linexp(this.vavlue, 0,1, 6,1.5)
}
const instrument = 'felt'
const blockSize = 2048
const brown = new Brown(10)
const mTrig = Trig()
const mTDiv = TDiv()
const iTDiv = TDiv()
const cd1 = Changed()
const cd2 = Changed()
const cd3 = Changed()
let tick=3, interval, overlap, maxwait
let root = sc.round(rand()*6-6) + 60 // from middle C
let m = choose(mode)
let ggg = 0.5
let b, n1, n2, n3;
sldrSpeed.oninput()

const stream = () => {
  b = brown.next(
    sc.linlin(sldrMood.value, 0,1, 0.05,1.0),
    ggg
  )
  if (mTDiv(mTrig(b[0]), 20)) {
    let index = b[3] * 4
    index = sc.round(index)
    index = sc.mod(index, mode.length)
    m = mode[index]
    console.log('index: ' + index)
  }
}
const grain = () => {
  // note, pos, db, atk, rls, res
  n2 = sc.deg2key((b[7]+rand()*0.5)*m.length*2, m)+root
  PlaySample(
    n2,
    rand()*0.3,
    -18*rand(),
    0.05,
    0.07,
    0.7
  )
}
function init() {
  audio = new AudioContext({ latencyHint: blockSize/48000 });
  (async () => {
    verb = audio.createConvolver()
    await sc.load2buf('ir/vdsp-darkspace.wav', b => verb.buffer = b, e => console.log(`verb ${e}`))
    sample = new Sample(12, 6)
    sample.read(21, 98, './sample/felt/')
    master = audio.createGain()
    bus    = audio.createGain()
    bus.connect(verb)
    verb.connect(master)
    master.connect(audio.destination)
    sldrVolume.oninput()
    setInterval(stream, 50)
    setInterval(grain, 50)
  })();
  b = brown.next(
    sc.linlin(sldrMood.value, 0,1, 0.05,1.0),
    ggg
  )
}
playButton.onclick = () => {
  playButton.remove()
  init()
}
