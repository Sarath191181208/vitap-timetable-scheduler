import { is_same_slot } from "./impls/time_table";

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function hsl2rgb(h, s, l) {
    const r = Math.round(255 * (Math.cos(h * Math.PI / 180) + 1) / 2 * s * l);
    const g = Math.round(255 * (1 - Math.abs(Math.cos((h + 120) * Math.PI / 180)) / 2) * s * l);
    const b = Math.round(255 * (1 - Math.abs(Math.cos((h + 240) * Math.PI / 180)) / 2) * s * l);
    return [r, g, b];
}

function getRandomPastelColor() {
    // Generate a random hue between 0 and 360 degrees, ensuring a pastel range
    const hue = Math.random() * 360; // Skew towards pastel hues

    // Set saturation and lightness within a pastel range
    const saturation = 65 + Math.random() * 10; // Low to moderate saturation
    const lightness = 75 + Math.random() * 15; // Moderate to high lightness

    // Convert HSV to RGB using a concise formula
    const rgb = hsl2rgb(hue, saturation / 100, lightness / 100);

    return rgb.map(x => x.toString(16).padStart(2, '0')).join('');
}

function getSubjectColorDict(subjectNameArr) {
    const subjectColorDict = {};
    for (const subj of subjectNameArr) {
        let clr = localStorage.getItem(subj);
        if (clr == null) {
            clr = getRandomPastelColor();
            clr = clr.slice(0, 6) + "FF";

            localStorage.setItem(subj, clr);
        }
        subjectColorDict[subj] = clr;
    }
    return subjectColorDict;
}

const withOpacity = (color, opacity) => {
    const [r, g, b] = color.match(/\w\w/g).map((x) => parseInt(x, 16));
    return `rgba(${r},${g},${b},${opacity})`;
};

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
    withOpacity,
    isInDisabledSlots,
    getActualSlotDict,
    getMaskedSubSlotDict,
    getSubjectColorDict,
    findCommonSlot
}
