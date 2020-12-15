import { load2buf } from './sc.js'

export class SoundScape {
  constructor() {
    this.buffer = null
    this.isPlaying = false
  }
  read(path) {
    return load2buf(path, b => this.buffer = b, e => console.log(`SoundScape ${e}`))
  }
  trash() { this.buffer = null }
}
