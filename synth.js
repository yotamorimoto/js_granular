import { midicps, dbamp, linexp } from './sc.js'
import { rand, exprand, choose } from './random.js'
const eps = Number.EPSILON

class Panner {
  constructor(pan=0) {
    // safari has no stereo panner
    if (audio.createStereoPanner) {
        this.node = audio.createStereoPanner()
        this.node.pan.value = pan
    } else {
        this.node = audio.createPanner()
        this.node.panningModel = 'equalpower'
        this.node.setPosition(pan, 0, 1 - Math.abs(pan))
    }
    return this.node
  }
}
class Env {
  constructor(level=1, offset=0) {
    this.vca = audio.createGain()
    this.level = level
    this.offset = offset
  }
}
class Perc extends Env {
  trigger(attack, release) {
    const now = audio.currentTime
    this.vca.gain.setValueAtTime(this.offset, now)
    this.vca.gain.linearRampToValueAtTime(this.level, now + attack)
    this.vca.gain.exponentialRampToValueAtTime(Math.max(eps, this.offset), now + attack + release)
  }
}
class AR extends Env {
  trigger(attack, release) {
    const now = audio.currentTime
    this.vca.gain.cancelScheduledValues(now)
    this.vca.gain.setValueAtTime(0, now)
    this.vca.gain.linearRampToValueAtTime(1, now + attack)
    this.vca.gain.linearRampToValueAtTime(0, now + attack + release)
  }
}
class ASR extends Env {
  trigger(attack, sustain, release) {
    const now = audio.currentTime
    this.vca.gain.setValueAtTime(this.offset, now)
    this.vca.gain.linearRampToValueAtTime(this.level, now + attack)
    this.vca.gain.linearRampToValueAtTime(this.level, now + attack + sustain)
    this.vca.gain.linearRampToValueAtTime(0, now + attack + sustain + release)
  }
}
function set_xfade(a, b, fade) {
  a.gain.value = Math.cos(fade * 0.5*Math.PI)
  b.gain.value = Math.cos((1.0-fade) * 0.5*Math.PI)
}
function connect(...nodes) {
  for (let i=0; i<nodes.length-1; i++) nodes[i].connect(nodes[i+1])
}
function schedTrash1(time, node) {
  const when = audio.currentTime + time
  node.stop(when+0.1)
  setTimeout(() => {
    node.disconnect()
    node = null
  }, when*1000+200)
}
function schedTrash(time, ...nodes) {
  const when = audio.currentTime + time
  for (let i=0; i<nodes.length; i++) nodes[i].stop(when+0.1)
  setTimeout(() => {
    for (let i=0; i<nodes.length; i++) nodes[i].disconnect()
    nodes = null
  }, when*1000+200)
}
function schedDone(time, node) {
  setTimeout(() => node.isPlaying = false, time*1000)
}

export function Sine(note, db, atk, rls, res) {
  const vco = audio.createOscillator()
  const out = audio.createGain()
  const fxg = audio.createGain()
  const env = new Perc(dbamp(db-(note/127*8)))
  const panner = new Panner(rand()*2-1)
  vco.frequency.value = midicps(note)
  set_xfade(out, fxg, res)
  connect(vco, env.vca, panner, out, master)
  connect(panner, fxg, bus)
  vco.start()
  env.trigger(atk, rls)
  schedTrash(atk+rls, vco)
}
export function Pad(note, db, atk, rls, res) {
  const vco = audio.createOscillator()
  const out = audio.createGain()
  const fxg = audio.createGain()
  const env = new AR(dbamp(db-(note/127*8)))
  const panner = new Panner(rand()*2-1)
  vco.setPeriodicWave(wavetable)
  vco.frequency.value = midicps(note)
  set_xfade(out, fxg, res)
  connect(vco, env.vca, panner, out, master)
  connect(panner, fxg, bus)
  vco.start()
  env.trigger(atk, rls)
  schedTrash(atk+rls, vco)
}
export function PlaySample(note, pos, db, atk, rls, res) {
  let filter = audio.createBiquadFilter()
  let smp = audio.createBufferSource()
  const now = audio.currentTime
  const out = audio.createGain()
  const fxg = audio.createGain()
  const amp = dbamp(db+sample.db)
  const env = new AR(amp)
  const panner = new Panner(rand()*2-1)
  const map = sample.map[note]
  smp.buffer = sample.buffers[map[0]]
  smp.playbackRate.cancelScheduledValues(now)
  smp.playbackRate.value = map[1]
  filter.type = 'lowpass'
  filter.frequency.value = linexp(0.01, 1, 500, 12000)
  set_xfade(out, bus, res)
  connect(smp, env.vca, panner, out, master)
  connect(panner, filter, fxg, bus)
  env.trigger(atk, rls)
  smp.start(now, pos)
  smp.stop(now + atk + rls + 0.1)
  smp.onended = () => { smp.disconnect(); smp = null }
  // schedTrash1(atk+rls+0.2, smp)
}
export function PlaySoundScape(amp) {
  const smp = audio.createBufferSource()
  const out = audio.createGain()
  const env = new AR(amp)
  const buf = soundscape.buffer
  const duration = buf.duration
  const fade = choose([3, 5, 8, 13])
  const dur = fade * 2
  const silence = exprand(0.1, 10)
  smp.buffer = buf
  connect(smp, env.vca, out, master)
  smp.start(0, rand()*(duration-fade*2))
  env.trigger(fade,fade)
  schedDone(dur, soundscape)
}
