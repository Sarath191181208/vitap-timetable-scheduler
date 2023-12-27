
/**
 * @type {TimeTable}
 */
const time_table = {
    "Tuesday": ["TAA1+L1", "C1+L2", "B1+L3", "D1+L4", "G1+L5", "L6", "G2+L31", "B2+L32", "C2+L33", "D2+L34", "TAA2+L35", "L36"],
    "Wednesday": ["TF1+L7", "B1+L8", "C1+L9", "A1+L10", "D1+L11", "L12", "D2+L37", "C2+L38", "A2+L39", "B2+L40", "TF2+L41", "L42"],
    "Thursday": ["TG1+L13", "TDD1+L14", "E1+L15", "F1+L16", "A1+L17", "L18", "E2+L43", "TDD2+L44", "A2+L45", "F2+L46", "TG2+L47", "L48"],
    "Friday": ["TCC1+L19", "G1+L20", "F1+L21", "E1+L22", "TB1+L23", "L24", "TB2+L49", "E2+L50", "F2+L51", "G2+L52", "TCC2+L53", "L54"],
    "Saturday": ["TE1+L25", "TC1+L26", "TBB1+L27", "TA1+L28", "TD1+L29", "L30", "TD2+L55", "TC2+L56", "TBB2+L57", "TA2+L58", "TE2+L59", "L60"]
};


/**
 * @type {string[]}
 */
const time_arr = ["8:00", "9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6.00", "7.00"];

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
    if (numberOfPluses === 2) return 4;
    if (numberOfPluses === 1) return 3;
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

export { time_table, time_arr, getCreditsFromSlot };