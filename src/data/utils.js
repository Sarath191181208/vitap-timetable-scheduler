import { is_same_slot } from "./impls/time_table";

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function getSubjectColorDict(subjectNameArr) {
    const subjectColorDict = {};
    for (const subj of subjectNameArr) {
        let clr = localStorage.getItem(subj);
        if (clr == null) {
            clr = Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, "0")
                .toUpperCase();

            localStorage.setItem(subj, clr);
        }
        subjectColorDict[subj] = clr;
    }
    return subjectColorDict;
}

function findCommonSlot(subTimeSlotArr, subSlotArr) {
    for (const timeSlot of subTimeSlotArr) {
        for (const subSlot of subSlotArr) {
            if (is_same_slot(timeSlot, subSlot)) {
                return subSlot;
            }
        }
    }
}

function isInDisabledSlots(subSlot, disabledSlots) {
    if (disabledSlots.length === 0) return false;
    if (subSlot == null) {
        console.log("Check box has null ????");
        return false;
    }
    for (const disabledSlot of disabledSlots) {
        if (is_same_slot(subSlot, disabledSlot)) {
            return true;
        }
    }
    return false;
}

/**
 * 
 * @param {*} subjectMaskDict 
 * @param {*} subSlotDict 
 * @returns {import("../d").CourseNameAndSlots}
 */
function getMaskedSubSlotDict(subjectMaskDict, subSlotDict) {
    /** @type {import("../d").CourseNameAndSlots} */
    const maskedSubSlotDict = {};
    for (const [subName, subMask] of Object.entries(subjectMaskDict)) {
        const maskedSubSlotArr = subSlotDict[subName].filter((_, i) => subMask[i]);
        maskedSubSlotDict[subName] = maskedSubSlotArr;
    }
    return maskedSubSlotDict;
}

function getActualSlotDict(subTimeSlotDict, subjectSlotDict) {
    const actualSlotDict = {};
    for (const [subName, subTimeSlotArr] of Object.entries(subTimeSlotDict)) {
        const actualSlot = findCommonSlot(subTimeSlotArr, subjectSlotDict[subName]);
        actualSlotDict[subName] = actualSlot;
    }
    return actualSlotDict;
}

export { 
    isEmpty,
    isInDisabledSlots,
    getActualSlotDict,
    getMaskedSubSlotDict,
    getSubjectColorDict,
    findCommonSlot
}
