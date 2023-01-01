// write the parameters

import { is_same_slot, get_time_slots_for_slot } from "./data/time_table";

const getAllPickedSlots = (picked_slots_dict) => {
    const pickedSlots = [];
    for (const subject in picked_slots_dict) {
        pickedSlots.push(...picked_slots_dict[subject]);
    }
    return pickedSlots;
}

const compareArrays = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

const compareKeys = (dict1, dict2) => {
    const keys1 = Object.keys(dict1);
    const keys2 = Object.keys(dict2);
    return compareArrays(keys1, keys2);
}

const compareValues = (dict1, dict2) => {
    for (const key in dict1) {
        if (!compareArrays(dict1[key], dict2[key])) return false;
    }
    return true;
}

const comparePickedSlotsDicts = (dict1, dict2) => {
    if (dict1 === null || dict2 === null) {
        return false;
    }
    const isKeysSame = compareKeys(dict1, dict2);
    if (!isKeysSame) return false;
    const isValuesSame = compareValues(dict1, dict2);
    if (!isValuesSame) return false;
    return true;
}

const comparePickedSlots = (picked_slots_dict, alredyPickedTimeTableConfigsArray) => {
    for (let i = 0; i < alredyPickedTimeTableConfigsArray.length; i++) {
        const timeTableConfig = alredyPickedTimeTableConfigsArray[i];
        if (comparePickedSlotsDicts(picked_slots_dict, timeTableConfig)) {
            return true;
        }
    }
    return false;
}

const pick_slot = (subjects_list, picked_slots_dict, subSlotDict, alredyPickedTimeTableConfigsArray) => {
    if (subjects_list.length === 0) {
        if (alredyPickedTimeTableConfigsArray == null) return true;
        console.log("alredyPickedTimeTable", alredyPickedTimeTableConfigsArray)
        let isSameDict = comparePickedSlots(picked_slots_dict, alredyPickedTimeTableConfigsArray);
        if (isSameDict) return false;
        alredyPickedTimeTableConfigsArray.push(picked_slots_dict);
        return true;
    }

    const subject = subjects_list[0];
    const subSlots = subSlotDict[subject];

    const pickedSlots = getAllPickedSlots(picked_slots_dict);
    // subSlots - pickedSlots
    const filteredSubSlots = subSlots.filter((subSlot) => {
        for (const pickedSlot of pickedSlots) {
            if (is_same_slot(pickedSlot, subSlot)) {
                return false;
            }
        }
        return true;
    });

    if (filteredSubSlots.length === 0) return false;

    for (const filteredSubSlot of filteredSubSlots) {
        picked_slots_dict[subject] = get_time_slots_for_slot(filteredSubSlot);
        if (pick_slot(subjects_list.slice(1), picked_slots_dict, subSlotDict, alredyPickedTimeTableConfigsArray)) {
            return true;
        }
        picked_slots_dict[subject] = null;
    }

    return false;
}

export { pick_slot };