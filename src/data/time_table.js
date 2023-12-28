const time_table = {
    "Tuesday": [ "TF1+L1", "TA1+L2", "E1+STC2+L3", "D1+L4", "B1+L5", "L6", "TA2+L31", "E2+STC1+L32", "D2+L33", "B2+L34", "TF2+L35", "L36" ],
    "Wednesday": [ "TCC1+L7", "E1+STA2+L8", "G1+TFF1+L9", "TBB1+L10", "TDD1+L11", "L12", "E2+STA1+L37", "G2+TFF2+L38", "TBB2+L39", "TDD2+L40", "TCC2+L41", "L42" ],
    "Thursday": [ "TE1+L13", "C1+L14", "A1+L15", "F1+L16", "D1+L17", "L18", "C2+L43", "A2+L44", "F2+L45", "D2+L46", "TE2+L47", "L48" ],
    "Friday": [ "TAA1+L19", "TD1+L20", "B1+L21", "G1+TEE1+L22", "C1+L23", "L24", "TD2+L49", "B2+L50", "G2+TEE2+L51", "C2+L52", "TAA2+L53", "L54" ],
    "Saturday": [ "TG1+L25", "TB1+L26", "TC1+L27", "A1+L28", "F1+L29", "L30", "TB2+L55", "TC2+L56", "A2+L57", "F2+L58", "TG2+L59", "L60"]
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