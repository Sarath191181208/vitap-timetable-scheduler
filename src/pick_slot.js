// write the parameters

import { is_same_slot, get_time_slots_for_slot } from "./data/time_table";

const getAllPickedSlots = (picked_slots_dict) => {
    const pickedSlots = [];
    for (const subject in picked_slots_dict) {
        pickedSlots.push(...picked_slots_dict[subject]);
    }
    return pickedSlots;
}

const pick_slot = (subjects_list, picked_slots_dict, subSlotDict) => {
    if(subjects_list.length === 0) {
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

    if(filteredSubSlots.length === 0) return false;

    for (const filteredSubSlot of filteredSubSlots) {
        picked_slots_dict[subject] = get_time_slots_for_slot(filteredSubSlot);
        console.log(picked_slots_dict[subject])
        if (pick_slot(subjects_list.slice(1), picked_slots_dict, subSlotDict)) {
            return true;
        }
        picked_slots_dict[subject] = null;
    }

    return false;
}

export { pick_slot };