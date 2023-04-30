
const time_table = {
    "Monday": ["D1+L1","C1+L2","F1+TCC2+L3","TE1+L4","D2+L25","C2+L26","F2+TCC1+L27","TE2+L28","L29", "L30"],
    "Tuesday": ["B1+L5","A1+L6","C1+L7","TD1+L8","B2+L31","A2+L32","C2+L33","TD2+L34","L35", "L36"],
    "Wednesday": ["E1+L9","F1+TBB2+L10","TC1+L11","D1+L12","E2+L37","F2+TBB1+L38","TC2+L39","D2+L40","L41", "L42"],
    "Thursday": ["F1+TDD2+L13","E1+L14","TB1+L15","TA1+L16","F2+TDD1+L43","E2+L44","TB2+L45","TA2+L46","L47", "L48"],
    "Friday": ["C1+L17","D1+L18","E1+L19","TF1+TAA2+L20","C2+L49","D2+L50","E2+L51","TF2+TAA1+L52","L53", "L54"],
    "Saturday": ["B1+L21","B1+L22","A1+L23","A1+L24","B2+L55","B2+L56","A2+L57","A2+L58","L59", "L60"]
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

const time_arr = ["9:00", "10:00", "11:00", "12:00", "2:00", "3:00", "4:00", "5:00", "6.00", "7.00"];

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