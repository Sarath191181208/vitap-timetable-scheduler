const time_table = {
  "Monday":   [ "TBB+L1" , "TBB+L2", "TAA+L3", "TAA+L4", "TCC+L25", "TCC+L26", "TD+L27", "TD+L28" ],
  "Tuesday":  [ "TC+L5"  , "TC+L6", "TB+L7", "TB+L8", "TA+L29", "TA+L30", "D+L31", "D+L32" ],
  "Wednesday":[ "B+L9"   , "B+L10", "A+L11", "A+L12", "C+L33", "C+L34", "D+L35", "D+L36" ],
  "Thursday": [ "B+L13"  , "B+L14", "C+L15", "C+L16", "A+L37", "A+L38", "D+L39", "D+L40" ],
  "Friday":   [ "TA+L17" , "TA+L18", "TB+L19", "TB+L20", "TC+L41", "TC+L42", "D+L43", "D+L44" ],
  "Saturday": [ "TBB+L21", "TBB+L22", "TCC+L23", "TCC+L24", "TAA+L45", "TAA+L46", "TD+L47", "TD+L48" ]
};


/**
 * @type {string[]}
 */
const time_arr = ["9:00", "10:00", "11:00", "12:00", "2:00", "3:00", "4:00", "5:00"];

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
const getCreditsFromSlot = (slot) => {
  const isLab = slot.startsWith("L");
  if (isLab) return 1;
  const numberOfPluses = slot.split("+").length - 1;
  if (isExceptionSlot(slot)) return 3;
  if (numberOfPluses === 2) return 3;
  if (numberOfPluses === 1) return 2;
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
