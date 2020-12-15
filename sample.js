import { series, midiratio, load2buf } from './sc.js'

export class Sample {
  constructor(n, db=0) {
    this.buffers = new Array(n)
    this.map = new Array(128)
    this.db = db
  }
  read(lowest, highest, path) {
    const dict = new Array(this.buffers.length)
    const up = 2
    const down = 4
    const interval = up + 1 + down;
    (async () => {
      for (let i=0; i<this.buffers.length; i++) {
        await load2buf(path + i + '.mp3', b => this.buffers[i] = b, e => console.log(`sample ${e}`))
      }
    })();
    for (let i=0,note=lowest; i<this.buffers.length; i++,note+=interval) {
      dict[i] = new Array(note, series(note-down, note+up+1));
      if (note == lowest) dict[i] = new Array(note, series(0, lowest+up+1));
      if (note == highest) dict[i] = new Array(note, series(highest-down, 128));
    }
    let bufindex = 0;
    for (const item of dict) {
      for (const note of item[1]) {
        this.map[note] = new Array(bufindex, midiratio(note - item[0]));
      }
      bufindex++;
    }
  }
  trash() { this.buffers = null; this.map = null }
}
