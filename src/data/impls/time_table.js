// @ts-check

/**
 * @param {string} slot1
 * @param {string} slot2
 * @returns {boolean}
 * @description checks if two slots are same
*/
const is_same_slot = (slot1, slot2) => {
    const split1 = slot1.split("+").map((item) => item.trim());
    const split2 = slot2.split("+").map((item) => item.trim());
    for (const slot of split1) {
        if (split2.includes(slot)) return true;
    }
    return false;
}

/**
 * @param {Object} timeTable
 * @param {string} slot
 * @returns {string[]}
 * @description gets time slots for a given slot
*/
const get_time_slots_for_slot = (timeTable, slot) => {
    const _temp_arr = [];
    for (const day_name of Object.keys(timeTable)) {
        const day = timeTable[day_name];
        // iterate day
        for (const element of day) {
            if (is_same_slot(element, slot)) {
                _temp_arr.push(element);
            }
        }
    }
    return _temp_arr;
}

export { is_same_slot, get_time_slots_for_slot };