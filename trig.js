export function Trig() {
  let prev = 0;
  return val => {
    const t = prev < 0 && val >= 0;
    prev = val;
    return t;
  }
};

export function Changed() {
  let prev = 0;
  return val => {
    const t = prev !== val;
    prev = val;
    return t;
  };
};

export function TDiv() {
  let prev = 0;
  return (val, div) => {
    let t = false;
    if (val) prev++;
    if (prev === div) {
      t = true;
      prev = 0;
    } else { t = false }
    return t;
  };
};

export function Latch() {
  let held;
  return (val, trig) => {
    if (!!trig) { held = val }
    return held;
  };
};
