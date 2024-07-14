import lab_data from "./update/lab_data";
import theoryData from "./update/theory_data";

const subSlotDict = {};
const options = [];
for (const [key, value] of Object.entries(lab_data)) {
    options.push({ value: key, label: key });
    subSlotDict[key] = value;
}
for (const [key, value] of Object.entries(theoryData)) {
    options.push({ value: key, label: key });
    subSlotDict[key] = value;
}


export { subSlotDict, options };
