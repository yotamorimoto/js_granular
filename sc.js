// series
function *range(start, stop, step=1) { for (let n=start; n<stop; n+=step ) yield n }
export const series = (start, stop, step=1) => Array.from(range(start, stop, step));
// very fast int round
export const round = a => (a + (a > 0 ? 0.5 : -0.5)) << 0;
// fast int division
export const div = (a, b) => a / b >> 0;
// neg mod is different in sc
export const mod = (n,m) => ((n % m) + m) % m;

// degree to midi key
export const deg2key = (degree, mode) => {
  const size = mode.length;
  const deg = round(degree);
  return (12 * div(deg, size)) + mode[mod(deg, size)];
};

export const fold = (x, lo, hi) => {
  const mod = (x, y) => ((x % y) + y) % y;
  x -= lo;
  const r = hi - lo;
  const w = mod(x, r);
  return (mod(x / r, 2) > 1) ? (hi - w) : (lo + w);
};
// bipolar out
export const fold2 = a => fold(a, -1, 1);

export const midiratio = midi => Math.pow(2.0, midi * 0.083333333333);

export const midicps = midi => 440. * Math.pow(2.0, (midi - 69.0) * 0.083333333333);

export const cpsmidi = cps => Math.log2(cps * 0.002272727272727272727272727) * 12. + 69.;

export const dbamp = db => Math.pow(10, db * 0.05);

export const ampdb = amp => Math.log10(amp) * 20.;

export const linlin = (x, a, b, c, d) => {
  if (x <= a) {
    return c;
  }
  if (x >= b) {
    return d;
  }
  return (x - a) / (b - a) * (d - c) + c;
};
export const linexp = (x, a, b, c, d) => {
  if (x <= a) {
    return c;
  }
  if (x >= b) {
    return d;
  }
  return Math.pow(d / c, (x - a) / (b - a)) * c;
};

export const load2buf = async (path, yesfunc, nofunc) => {
  let res = await fetch(path)
  let buf = await res.arrayBuffer()
  let promise = new Promise((resolve, reject) => {
    audio.decodeAudioData(buf, resolve, reject)
  })
  promise.then(yesfunc, nofunc)
  return promise
}
