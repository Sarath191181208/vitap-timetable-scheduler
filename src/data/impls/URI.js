import { compressToEncodedURIComponent } from "lz-string";
import { findCommonSlot } from "../time_table";


export const getCompressedURIFromData = (timeTable, subSlotDict) => {
  const originalSlots = getSubjectSlots(timeTable, subSlotDict);
  const compressedSlots = getCompressedSlots(originalSlots);
  return (compressToEncodedURIComponent(JSON.stringify(compressedSlots)));
}

const getSubjectSlots = (timeTable, subSlotDict) => {
  const originalSlots = {};
  // iterate timetable
  for (const [subName, timeSlots] of Object.entries(timeTable)) {
    // get the all the possible slots
    const timeSlotsForSubj = subSlotDict[subName];
    // get the currennt slot that matches all the slots colored in the time table
    originalSlots[subName] = findCommonSlot(timeSlotsForSubj, timeSlots);
  }
  return originalSlots;
};

// originalSlots = {subName: [slot1, slot2, slot3]}
const getCompressedSlots = (originalSlots) => {
  const newData = {};
  // iterate the keys of the original slots
  for (const subName of Object.keys(originalSlots)) {
    const isLab = subName.includes("LAB");
    const courseCode = subName.split("-")[0];
    newData[courseCode + isLab ? "L" : ""] = originalSlots[subName];
  }
  console.log();
  return newData;
};
