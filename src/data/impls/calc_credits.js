// @ts-check 

import { is_same_slot } from "./time_table";

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
export const getCreditsFromSlot = (slot) => {
  const isLab = slot.startsWith("L");
  if (isLab) return 1;
  const numberOfPluses = slot.split("+").length - 1;
  // if (isExceptionSlot(slot)) return 3;
  if (numberOfPluses === 1) return 3;
  // if (numberOfPluses === 1) return 2;
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

/**
 * @param {string[]} originalSlots
 * @param {string[]} timetableSlots
 */
export function findCommonSlot(originalSlots, timetableSlots) {
  // include the slot in originalSlots only if it matches
  // with `is_same_slot` function for all the slots in timetableSlots

  const commonSlots = originalSlots.filter((/** @type {string} */ slot) => {
    return timetableSlots.every((/** @type {string} */ timetableSlot) => {
      return is_same_slot(slot, timetableSlot);
    });
  });

  return commonSlots;
}
