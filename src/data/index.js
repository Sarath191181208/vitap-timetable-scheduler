import { subSlotDict as ssd1, options as opt1 } from "../data/sub_slot_data";
import { getCreditsFromSlot as gcfs1, time_arr as ta1, time_table as tt1 } from "../data/time_table";

/**
 * 
 * @param {string} id 
 */
export function getData(id) {
    if (id == "Batch-2021") {
        const data = {
            subSlotDict: ssd1,
            options: opt1,
            time_arr: ta1,
            time_table: tt1,
            getCreditsFromSlot: gcfs1,
        }
        console.log(data);
        return data;
    }
    else
        return {
            subSlotDict: ssd1,
            options: opt1,
            time_arr: ta1,
            time_table: tt1,
            getCreditsFromSlot: gcfs1,
        }
}