// @ts-check

import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { get_time_slots_for_slot } from "./time_table";
import { findCommonSlot } from "./calc_credits";
import {
  COURSE_CODE_ENCODE_DICT,
  COURSE_SLOT_ENCODE_DICT,
} from "../update/compress_reference_dict";

export const getCompressedURIFromData = (timeTable, subSlotDict) => {
  const originalSlots = getSubjectSlots(timeTable, subSlotDict);
  const compressedSlots = getCompressedSlotNameData(originalSlots);
  const dataAsSTR = getCompressedDataAsSTR(compressedSlots);
  //console.log(dataAsSTR);
  return compressToEncodedURIComponent(dataAsSTR);
  //return compressToEncodedURIComponent(compress(dataAsSTR));
};

export const getDataFromCompressedURI = (compressedURI, subSlotDict, time_table) => {
  // decompress the json data
  const compressedSlots = decompressFromEncodedURIComponent(compressedURI);

  // iterate ever frame i.e 4 characters and decode the frame
  let data = {};
  for (let i = 0; i < compressedSlots.length; i += 4) {
    const frame = compressedSlots.slice(i, i + 4);
    const [courseName, courseSlot] = getDataFromFrame(frame);
    data[courseName] = courseSlot;
  }

  // get the new dict from courseCode to courseCode-cousename ex: {CSE: "CSE-Computer Science"}
  const courseCodeToName = getCourseCodeToNameDict(subSlotDict);

  // change the keys of the compressed slots to courseCode-courseName from courseCode
  const subjectSlotData = replaceDictKeys(data, courseCodeToName);

  console.log({ subjectSlotData });

  // get the time table data
  const timeTable = {};
  for (const [subName, slot] of Object.entries(subjectSlotData)) {
    if (!timeTable[slot]) {
      // get all the slots for the current slot
      timeTable[subName] = get_time_slots_for_slot(time_table, slot);
    }
  }

  return [timeTable, subjectSlotData];
};

const getCourseCodeToNameDict = (subSlotDict) => {
  const courseCodeToName = {};
  for (const subName of Object.keys(subSlotDict)) {
    courseCodeToName[getCourseCodeShort(subName)] = subName;
  }
  return courseCodeToName;
};

const replaceDictKeys = (dict, keyRefDict) => {
  const newDict = {};
  for (const [oldKey, data] of Object.entries(dict)) {
    const newKey = keyRefDict[oldKey];
    newDict[newKey] = data;
  }
  return newDict;
};

const getSubjectSlots = (timeTable, subSlotDict) => {
  const originalSlots = {};
  // iterate timetable
  for (const [subName, timeSlots] of Object.entries(timeTable)) {
    // get the all the possible slots ex: ["D", "TD", "TE"]
    const timeSlotsForSubj = subSlotDict[subName];
    // get the currennt slot that matches all the slots colored in the time table
    originalSlots[subName] = findCommonSlot(timeSlotsForSubj, timeSlots);
  }
  return originalSlots;
};

const getCompressedDataAsSTR = (data) => {
  //return compressToEncodedURIComponent(JSON.stringify(data));
  let str = "";
  for (const [key, value] of Object.entries(data)) {
    const courseBranch = key.slice(0, 3);
    const courseNumber = key.slice(3, 7);
    const isLab = key.slice(7, 8) == "L";
    let PART_1 = COURSE_CODE_ENCODE_DICT[courseBranch];
    // if is lab set the 2^6th bit to on
    if (isLab) {
      PART_1 |= 1 << 6;
    }
    const couseNumberInt = parseInt(courseNumber);
    const PART_2 = couseNumberInt / 100;
    const PART_3 = couseNumberInt % 100;
    const PART_4 = COURSE_SLOT_ENCODE_DICT[value];
    str += String.fromCharCode(PART_1);
    str += String.fromCharCode(PART_2);
    str += String.fromCharCode(PART_3);
    str += String.fromCharCode(PART_4);
  }
  return str;
};

const getDataFromFrame = (frame) => {
  const PART_1 = frame.charCodeAt(0);
  const PART_2 = frame.charCodeAt(1);
  const PART_3 = frame.charCodeAt(2);
  const PART_4 = frame.charCodeAt(3);

  const REV_COURSE_CODE_ENCODE_DICT = {};
  for (const [key, value] of Object.entries(COURSE_CODE_ENCODE_DICT)) {
    REV_COURSE_CODE_ENCODE_DICT[value] = key;
  }

  const courseBranch = REV_COURSE_CODE_ENCODE_DICT[PART_1 & 0b111111];
  const isLab = (PART_1 >> 6) & 1;
  const courseNumber = PART_2 * 100 + PART_3;
  const courseName = courseBranch + courseNumber + (isLab ? "L" : "");

  const REV_COURSE_SLOT_ENCODE_DICT = {};
  for (const [key, value] of Object.entries(COURSE_SLOT_ENCODE_DICT)) {
    REV_COURSE_SLOT_ENCODE_DICT[value] = key;
  }
  const courseSlot = REV_COURSE_SLOT_ENCODE_DICT[PART_4];
  return [courseName, courseSlot];
};

// originalSlots = {subName: [slot1, slot2, slot3]}
const getCompressedSlotNameData = (originalSlots) => {
  const newData = {};
  for (const [subName, data] of Object.entries(originalSlots)) {
    newData[getCourseCodeShort(subName)] = data;
  }

  // join all the slots that match the course code
  for (const [subName, data] of Object.entries(newData)) {
    const prevData = data;
    const prevDataStr = prevData.join(" ");
    newData[subName] = prevDataStr;
  }

  return newData;
};

const getCourseCodeShort = (/** @type {string} */ subName) => {
  const isLab = subName.includes("LAB");
  const courseCode = subName.split("-")[0];
  return courseCode + (isLab ? "L" : "");
};
