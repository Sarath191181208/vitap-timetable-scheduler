// @ts-check
import { subSlotDict as ssd1, options as opt1 } from "../data/sub_slot_data";
import { getCreditsFromSlot } from "./impls/calc_credits";
import { time_arr, time_table } from "./update/time_table";

/**
 * 
 * @param {string} id 
 */
export function getData(id) {
    if (id == "Batch-2021-WIN") {
        const data = {
            subSlotDict: ssd1,
            options: opt1,
            time_arr: time_arr,
            time_table: time_table,
            getCreditsFromSlot: getCreditsFromSlot,
        }
        return data;
    }
    else
        return {
            subSlotDict: ssd1,
            options: opt1,
            time_arr: time_arr,
            time_table: time_table,
            getCreditsFromSlot: getCreditsFromSlot,
        }
}
