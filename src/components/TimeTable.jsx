// @ts-check

import React from "react";

const colorOpacity = 0.8;

import {
  getActualSlotDict,
  getSubjectColorDict,
  withOpacity,
} from "../data/utils";

/**
 * @typedef {Object} TimeTableProps
 * @property {Object} time_table
 * @property {Object} subTimeSlotDict
 * @property {Object} subSlotDict
 * @property {Function} onSlotTap
 * @property {Array} blockedTimeSlots
 * @property {Array} time_arr
 * @returns {import("react").ReactNode}
 */
export const TimeTable = ({
  time_table,
  subTimeSlotDict,
  subSlotDict,
  onSlotTap,
  blockedTimeSlots,
  time_arr,
}) => {
  const slotSubjectDict = {};
  for (const [subName, timeSlots] of Object.entries(subTimeSlotDict)) {
    // iterate the value arr
    for (const tSlot of timeSlots) {
      slotSubjectDict[tSlot] = subName;
    }
  }

  const subjectNameArr = Object.keys(subTimeSlotDict);
  const subjectColorDict = getSubjectColorDict(subjectNameArr);
  const actualSlotDict = getActualSlotDict(subTimeSlotDict, subSlotDict);

  const rows = [];

  for (const [key, value] of Object.entries(time_table)) {
    rows.push(
      <tr key={key}>
        <td>{key}</td>
        {value.map((slot) =>
          slot in slotSubjectDict
            ? (
              <td
                onClick={() => onSlotTap(slot)}
                key={slot}
                data-hover={slotSubjectDict[slot]}
                style={{
                  backgroundColor: `${withOpacity(
                    subjectColorDict[slotSubjectDict[slot]],
                    colorOpacity,
                  )
                    }`,
                }}
                className="table--single-slot min-w"
              >
                {slot}
              </td>
            )
            : (
              <td
                onClick={() => onSlotTap(slot)}
                key={slot}
                className={`min-w ${blockedTimeSlots.includes(slot) ? "blocked-time-slot" : ""
                  }`}
              >
                {slot}
              </td>
            )
        )}
      </tr>,
    );
  }

  return (
    <>
      <div className="time-table">
        <table>
          <TableHead time_arr={time_arr} />
          <tbody>{rows}</tbody>
        </table>
      </div>
      <ColorDict
        subjectColorDict={subjectColorDict}
        actualSlotDict={actualSlotDict}
      />
    </>
  );
};

function TableHead({ time_arr }) {
  return (
    <thead>
      <tr>
        <th>Time</th>
        {time_arr.map((day) => <th key={day}>{day}</th>)}
      </tr>
    </thead>
  );
}

function ColorDict({ subjectColorDict, actualSlotDict }) {
  const rows = [];

  for (const [key, value] of Object.entries(subjectColorDict)) {
    rows.push(
      <div
        className="subject-block"
        style={{ backgroundColor: `${withOpacity(value, colorOpacity)}` }}
        key={key}
      >
        {key}
        <div>
          {" "}
          <span className="slot">{" " + actualSlotDict[key]}</span>
        </div>
      </div>,
    );
  }

  return <div className="subject-color-grid">{rows}</div>;
}
