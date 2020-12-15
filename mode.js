//
const ionian = [0,2,4,5,7,9,11]
const ionia = [0,2,4,5,7,11]
const ioni = [0,2,4,5,7]
const ion = [0,4,5,7]
const io = [0,4,5]

// melodic minor
const melodicminor = [0,2,3,5,7,9,11]
const lydianaug = [0,2,4,6,8,9,11]
const lydiandom = [0,2,4,5,7,8,10]

//
const locrian = [0,1,3,5,6,8,10]
const phrygian = [0,1,3,5,7,8,10]
const aeolian = [0,2,3,5,7,8,10]
const dorian = [0,2,3,5,7,9,10]
const mixolydian = [0,2,4,5,7,9,10]
const lydian = [0,2,4,6,7,9,11]

const fifth = [phrygian, aeolian, dorian, mixolydian, ionian, lydian]
// major
const major1 = [mixolydian, ionian, lydian]
const major2 = [lydiandom, mixolydian, ionian, lydian, lydianaug]
// minor
const minor1 = [phrygian, aeolian, dorian]
const minor2 = [locrian, phrygian, aeolian, dorian, melodicminor]

export const mode = [io, ion, ioni, ionia, ionian]
