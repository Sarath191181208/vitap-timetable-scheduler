
const time_table = {
    // | Day       | 9:00    |    10:00       |      11:00        |     12:00        |    2:00        |    3:00        |    4:00        |    5:00         |
    "Tuesday": ["A1+SA1+L1  ", " G1+L2         ", " E1+L3        ", " TD1+L4       ", " A2+SA2+L21  ", " TB2+SB2+L22 ", " E2+L23      ", " C2+SC2+L24   "],
    "Wednesday": ["B1+SB1+L5  ", " A1+SA1+L6   ", " G1+L7        ", " C1+SC1+L8    ", " B2+SB2+L27  ", " A2+SA2+L28  ", " G2+STC2+L29 ", " TD2+L30      "],
    "Thursday": ["TC1+SC1+L9 ", " F1+STB1+L10  ", " TA1+SA1+L11  ", " E1+L12       ", " TC2+SC2+L33 ", " G2+STB2+L34 ", " TA2+SA2+L35 ", " E2+L36       "],
    "Friday": ["D1+L13     ", " C1+SC1+L14     ", " B1+SB1+L15   ", " TF1+STA1+L16 ", " D2+L39      ", " C2+SC2+L40  ", " B2+SB2+L41  ", " TG2+STA2+L42 "],
    "Saturday": ["TE1+L17    ", " D1+L18       ", " TG1+STC1+L19 ", " TB1+SB1+L20  ", " TE2+L45     ", " D2+L46      ", " -+L49       ", " -+L50        "],
};

const strip_spaces = (arr) => {
    const _temp_arr = [];
    for (const item of arr) {
        _temp_arr.push(item.trim());
    }
    return _temp_arr;
}

// strip spaces from the time table
for (const day_name of Object.keys(time_table)) {
    const day = strip_spaces(time_table[day_name]);
}

const time_arr = ["9:00", "10:00", "11:00", "12:00", "2:00", "3:00", "4:00", "5:00"];

const is_same_slot = (slot1, slot2) => {
    const split1 = strip_spaces(slot1.split("+"));
    const split2 = strip_spaces(slot2.split("+"));


    for (const slot of split1) {
        for (const s2 of split2) {
            if (slot === s2) {
                return true;
            }
        }
    }

    return false;
}


const get_time_slots_for_slot = (slot) => {
    const _temp_arr = [];

    // iterate time_table
    for (const day_name of Object.keys(time_table)) {
        const day = time_table[day_name];
        // iterate day
        for (let i = 0; i < day.length; i++) {
            if (is_same_slot(day[i], slot)) {
                _temp_arr.push(day[i]);
            }
        }
    }
    return _temp_arr;
}

export { time_table, is_same_slot, get_time_slots_for_slot, time_arr };