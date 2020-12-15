import { fold2 } from './sc.js';
import { rand } from './random.js'

export class Brown {
  constructor(n) {
    this.list = Float32Array.from(
      { length: n },
      () => rand() * 2 - 1
    );
  }
  _f(step, x) {
    return x + (rand() * 2 - 1) * step;
  }
  next(step, g) {
    const halfG = g * 0.5;
    // spread is fastest
    // http://jsben.ch/lO6C5
    const prev = [...this.list];
    const size = prev.length;
    for (let i = 0; i < size; i++) {
      this.list[i] =
        fold2(
          (1.0 - g) * this._f(step, prev[i])
          +
          halfG * (
            this._f(step, prev[(i === 0) ? size - 1 : i - 1]) +
            this._f(step, prev[(i === size - 1) ? 0 : i + 1])
          )
        );
    }
    return this.list;
  }
}
