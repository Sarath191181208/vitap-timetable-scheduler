export const time_table = {
  "Monday": [
    "L1",
    "L2",
    "TA+L3",
    "TB+L4",
    "TC+L25",
    "TD+L26",
    "TE+L27",
    "L28"
  ],
  "Tuesday": [
    "C+L5",
    "D+L6",
    "E+L7",
    "L8",
    "A+L29",
    "B+L30",
    "L31",
    "L32"
  ],
  "Wednesday": [
    "L9",
    "TE+L10",
    "TB+L11",
    "TA+L12",
    "TC+L33",
    "TD+L34",
    "L35",
    "L36"
  ],
  "Thursday": [
    "E+L13",
    "L14",
    "D+L15",
    "C+L16",
    "B+L37",
    "A+L38",
    "L39",
    "L40"
  ],
  "Friday": [
    "A+L17",
    "B+L18",
    "L19",
    "L20",
    "D+L41",
    "C+L42",
    "E+L43",
    "L44"
  ],
  "Saturday": [
    "L21",
    "L22",
    "C+L23",
    "D+L24",
    "A+L45",
    "B+L46",
    "E+L47",
    "L48"
  ]
};


/**
 * @type {string[]}
 */
export const time_arr = ["9:00", "10:00", "11:00", "12:00", "2:00", "3:00", "4:00", "5:00"];

const isExceptionSlot = (testSlot) => {
  const slots = [
    "B1+TB1+TBB1+TG1",
    "B2+TB2+TBB2+TG2",
    "A1+TA1+G1",
    "A2+TA2+G2",
    "B2+TB2+G2",
  ]
  for (const slot of slots)
    if (isEqualSlot(slot, testSlot)) return true;
  return false;
}

/**
 * @param {string} slot 
 * @returns {number}
 */
export const getCreditsFromSlot = (slot) => {
  console.log({ slot });
  const isLab = slot.startsWith("L");
  if (isLab) return 1;
  const numberOfPluses = slot.split("+").length - 1;
  // if (isExceptionSlot(slot)) return 3;
  if (numberOfPluses === 1) return 3;
  // if (numberOfPluses === 1) return 2;
  if (!slot.startsWith("T")) return 2;
  return 1;
};

/**
 * @param {string} slot1
 * @param {string} slot2
 * @returns {boolean}
 * @description checks if two slots are equal
*/
const isEqualSlot = (slot1, slot2) => {
  const split1 = slot1.split("+").map((item) => item.trim());
  const split2 = slot2.split("+").map((item) => item.trim());
  for (const slot of split1) {
    if (!split2.includes(slot)) return false;
  }
  return true;
}
