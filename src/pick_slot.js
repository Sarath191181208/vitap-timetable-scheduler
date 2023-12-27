import { get_time_slots_for_slot, is_same_slot } from "./data/impls/time_table";

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

/**
 * 
 * @param {import("./d").AllPossibleSubSlots} picked_slots_dict 
 * @param {import("./d").CourseNameAndSlots[]} alredyPickedTimeTableConfigsArray 
 * @returns {boolean}
 */
const comparePickedSlots = (picked_slots_dict, alredyPickedTimeTableConfigsArray) => {
    for (let i = 0; i < alredyPickedTimeTableConfigsArray.length; i++) {
        const timeTableConfig = alredyPickedTimeTableConfigsArray[i];
        if (comparePickedSlotsDicts(picked_slots_dict, timeTableConfig)) {
            return true;
        }
    }
    return false;
}

/**
 * @param {import("./d").TimeTable} timeTable 
 * @param {string[]} subjects_list 
 * @param {import("./d").CourseNameAndSlots} picked_slots_dict 
 * @param {import("./d").AllPossibleSubSlots} subSlotDict 
 * @param {import("./d").CourseNameAndSlots[]} alredyPickedTimeTableConfigsArray 
 * @returns 
 */
const pick_slot = (timeTable, subjects_list, picked_slots_dict, subSlotDict, alredyPickedTimeTableConfigsArray) => {
    if (subjects_list.length === 0) {
        if (alredyPickedTimeTableConfigsArray == null) return true;
        let isSameDict = comparePickedSlots(picked_slots_dict, alredyPickedTimeTableConfigsArray);
        if (isSameDict) return false;
        alredyPickedTimeTableConfigsArray.push(picked_slots_dict);
        return true;
    }

    const subject = subjects_list[0];
    const subSlots = subSlotDict[subject];
    // const pickedSlots = getAllPickedSlots(picked_slots_dict);
    const pickedSlots = Object.keys(picked_slots_dict).map((key) => picked_slots_dict[key]).flat();
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
        picked_slots_dict[subject] = get_time_slots_for_slot(timeTable, filteredSubSlot);
        if (pick_slot(timeTable, subjects_list.slice(1), picked_slots_dict, subSlotDict, alredyPickedTimeTableConfigsArray)) {
            return true;
        }
        picked_slots_dict[subject] = [];
    }

    return false;
}

export { pick_slot };