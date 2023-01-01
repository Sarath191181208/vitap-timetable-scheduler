import { useState, useRef } from "react";
import Select from "react-select";
import "./App.css";
import { time_table, time_arr } from "./data/time_table";
import { pick_slot } from "./pick_slot";
import { subSlotDict, options } from "./data/sub_slot_data";
import { is_same_slot } from "./data/time_table";
import { useCachedState } from "./hooks/useCachedState";

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function getMaskedSubSlotDict(subjectMaskDict, subSlotDict) {
  const maskedSubSlotDict = {};
  for (const [subName, subMask] of Object.entries(subjectMaskDict)) {
    const maskedSubSlotArr = subSlotDict[subName].filter((_, i) => subMask[i]);
    maskedSubSlotDict[subName] = maskedSubSlotArr;
  }
  return maskedSubSlotDict;
}

function getSubjectColorDict(subjectNameArr) {
  const subjectColorDict = {};
  for (const subj of subjectNameArr) {
    let clr = localStorage.getItem(subj);
    if (clr == null) {
      clr = Math.floor(Math.random() * 16777215).toString(16);
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

function getActualSlotDict(subTimeSlotDict, subjectSlotDict) {
  const actualSlotDict = {};
  for (const [subName, subTimeSlotArr] of Object.entries(subTimeSlotDict)) {
    const actualSlot = findCommonSlot(subTimeSlotArr, subjectSlotDict[subName]);
    actualSlotDict[subName] = actualSlot;
  }
  return actualSlotDict;
}

function App() {
  const [selecedSubjectsList, setSelecedSubjectsList] = useCachedState({
    cacheKey: "selecedSubjectsList",
    defaultValue: [],
  });
  const [timeTable, setTimetable] = useCachedState({
    cacheKey: "timeTable",
    defaultValue: {},
  });
  const [pickedSubSlotDict, setPickedSubSlotDict] = useCachedState({
    cacheKey: "pickedSubSlotDict",
    defaultValue: {},
  });
  const [blockedTimeSlots, setBlockedTimeSlots] = useCachedState({
    cacheKey: "blockedTimeSlots",
    defaultValue: [],
  });
  const alreadyPickedTimeTableConfigsArray = useRef([]);

  const onSubjectSelectChange = (e) => {
    setSelecedSubjectsList(e);
    if (e.length === 0) return;
    const newPickedSubSlotDict = updateSubSlotTaken(e, blockedTimeSlots);
    submitSubjects(e, newPickedSubSlotDict);
  };

  function markBlockedTimeSlotsInplace(
    subIsSlotTakenDict,
    _blockedTimeSlots,
    value = 0
  ) {
    for (const [subjName, isSubSlotTakenArr] of Object.entries(
      subIsSlotTakenDict
    )) {
      for (const [i, isSubSlotTaken] of isSubSlotTakenArr.entries()) {
        const subSlot = subSlotDict[subjName][i];
        for (const blockedTimeSlot of _blockedTimeSlots) {
          if (is_same_slot(subSlot, blockedTimeSlot)) {
            subIsSlotTakenDict[subjName][i] = value;
          }
        }
      }
    }
  }

  const updateSubSlotTaken = (selecedSubjectsList, _blockedTimeSlots) => {
    const _subIsSlotTakenDict = {};
    for (const subjectOptions of selecedSubjectsList) {
      const { value: subName } = subjectOptions;
      if (!(subName in pickedSubSlotDict))
        _subIsSlotTakenDict[subName] = new Array(
          subSlotDict[subName].length
        ).fill(1);
      else _subIsSlotTakenDict[subName] = pickedSubSlotDict[subName];
    }

    markBlockedTimeSlotsInplace(_subIsSlotTakenDict, _blockedTimeSlots);

    setPickedSubSlotDict(_subIsSlotTakenDict);
    return _subIsSlotTakenDict;
  };

  const onSelectBoxChange = (_pickedSubSlotDict) => {
    setPickedSubSlotDict(_pickedSubSlotDict);
    markBlockedTimeSlotsInplace(_pickedSubSlotDict, blockedTimeSlots);
    submitSubjects(selecedSubjectsList, _pickedSubSlotDict);
  };

  const submitSubjects = (
    selecedSubjectsList,
    _pickedSubSlotDict,
    isRefreshButtonPressed = null
  ) => {
    if (selecedSubjectsList.length === 0) {
      alert("Please select at least one subject");
      return;
    }

    const selectedSubjects = selecedSubjectsList.map(
      (subject) => subject.value
    );

    const tt = {};
    const maskedSubSlotDict = getMaskedSubSlotDict(
      _pickedSubSlotDict,
      subSlotDict
    );

    let isTrue = pick_slot(
      selectedSubjects,
      tt,
      maskedSubSlotDict,
      alreadyPickedTimeTableConfigsArray.current
    );

    // if not possible to generate timetable with already picked configs, try without them
    if (!isTrue && isRefreshButtonPressed === true) {
      alreadyPickedTimeTableConfigsArray.current = [];
      isTrue = pick_slot(
        selectedSubjects,
        tt,
        maskedSubSlotDict,
        alreadyPickedTimeTableConfigsArray.current
      );
    }

    if (isTrue) {
      setTimetable(tt);
    } else {
      alert("Sorry, no timetable could be generated");
    }
  };

  return (
    <>
      <div className="subject-selection-controls">
        <Select
          defaultValue={selecedSubjectsList}
          onChange={onSubjectSelectChange}
          closeMenuOnSelect={false}
          isMulti
          options={options}
          className="basic-multi-select"
        />

        <button
          onClick={() => {
            alreadyPickedTimeTableConfigsArray.current.push(timeTable);
            submitSubjects(selecedSubjectsList, pickedSubSlotDict, true);
          }}
        >
          {" "}
          ⟳{" "}
        </button>
      </div>

      {isEmpty(timeTable) ? (
        <div className="tutorial">
          <h2>How to use?</h2>
          <p>
            1. Select the subjects you want to take in the dropdown menu you can
            select multiple subjects from the same box
          </p>
          <p>2. You can search by typing the course name (or) course code.</p>
          <p>3. You will see the time table.</p>
          <p>4. Hover over the slot to know the course and it's code</p>
        </div>
      ) : (
        <div className="time-table-container">
          <TimeTable
            subTimeSlotDict={timeTable}
            onSlotTap={(timeSlot) => {
              let newBlockedTimeSlots = [];
              let isBlockedTimeSlotRemoved = false;
              if (blockedTimeSlots.includes(timeSlot)) {
                isBlockedTimeSlotRemoved = true;
                const index = blockedTimeSlots.indexOf(timeSlot);
                newBlockedTimeSlots = blockedTimeSlots.slice();
                newBlockedTimeSlots.splice(index, 1); // remove 1 item starting from index
              } else {
                newBlockedTimeSlots = [...blockedTimeSlots, timeSlot];
              }

              setBlockedTimeSlots(newBlockedTimeSlots);
              const newPickedSubSlotDict = updateSubSlotTaken(
                selecedSubjectsList,
                newBlockedTimeSlots
              );
              if (isBlockedTimeSlotRemoved) {
                markBlockedTimeSlotsInplace(
                  newPickedSubSlotDict,
                  [timeSlot],
                  1
                );
              }
              setPickedSubSlotDict(newPickedSubSlotDict);
              submitSubjects(selecedSubjectsList, newPickedSubSlotDict);
            }}
            blockedTimeSlots={blockedTimeSlots}
          />
        </div>
      )}
      <SubjectCheckBoxes
        pickedSubSlotDict={pickedSubSlotDict}
        onChange={onSelectBoxChange}
      />
    </>
  );
}

function SubjectCheckBoxes({ pickedSubSlotDict, onChange }) {
  const fillAll = (checked, isSlotTakenBoolenArray, subName) => {
    const placeHolder = [...isSlotTakenBoolenArray];
    placeHolder.fill(checked);
    const newDict = {
      ...pickedSubSlotDict,
      [subName]: placeHolder,
    };
    onChange(newDict);
  };
  const temp_arr = [];
  const subjectNameArr = Object.keys(pickedSubSlotDict);
  const subjectColorDict = getSubjectColorDict(subjectNameArr);
  for (const [subName, isSlotTakenBoolenArray] of Object.entries(
    pickedSubSlotDict
  )) {
    temp_arr.push(
      <div className="subject-checkbox" key={temp_arr.length}>
        <h3
          style={{
            "--data-pre-color": `#${subjectColorDict[subName]}`,
          }}
        >
          {subName}
        </h3>
        <input
          type="checkbox"
          name="select-all-checkbox"
          id={subName}
          onChange={(e) => {
            const { checked } = e.target;
            fillAll(checked, isSlotTakenBoolenArray, subName);
          }}
          checked={isSlotTakenBoolenArray.every((isSlotTaken) => isSlotTaken)}
        />
        <label htmlFor={subName}>Select All</label>

        <input
          type="checkbox"
          name="select-all-checkbox"
          id={subName}
          onChange={(e) => {
            const { checked } = e.target;
            fillAll(!checked, isSlotTakenBoolenArray, subName);
          }}
          checked={isSlotTakenBoolenArray.every((isSlotTaken) => !isSlotTaken)}
        />
        <label htmlFor={subName}>Unselect All</label>
        {isSlotTakenBoolenArray.map((isSlotTaken, i) => (
          <>
            <input
              type="checkbox"
              key={`${subName}-${i}`}
              id={i}
              checked={isSlotTaken}
              onChange={(e) => {
                const { checked } = e.target;
                const placeHolder = [...isSlotTakenBoolenArray];
                placeHolder[i] = checked;
                const newDict = {
                  ...pickedSubSlotDict,
                  [subName]: placeHolder,
                };
                onChange(newDict);
              }}
            />
            <label htmlFor={i}>{subSlotDict[subName][i]}</label>
          </>
        ))}
      </div>
    );
  }

  return <div className="subject-checkboxes">{temp_arr}</div>;
}

function TimeTable({ subTimeSlotDict, onSlotTap, blockedTimeSlots }) {
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
          slot in slotSubjectDict ? (
            <td
              onClick={() => onSlotTap(slot)}
              key={slot}
              data-hover={slotSubjectDict[slot]}
              style={{
                backgroundColor: `#${subjectColorDict[slotSubjectDict[slot]]}`,
              }}
            >
              {slot}
            </td>
          ) : (
            <td
              onClick={() => onSlotTap(slot)}
              key={slot}
              className={
                blockedTimeSlots.includes(slot) ? "blocked-time-slot" : ""
              }
            >
              {slot}
            </td>
          )
        )}
      </tr>
    );
  }

  return (
    <>
      <div className="time-table">
        <table>
          <TableHead />
          <tbody>{rows}</tbody>
        </table>
      </div>
      <ColorDict
        subjectColorDict={subjectColorDict}
        actualSlotDict={actualSlotDict}
      />
    </>
  );
}

function TableHead() {
  return (
    <thead>
      <tr>
        <th>Time</th>
        {time_arr.map((day) => (
          <th key={day}>{day}</th>
        ))}
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
        style={{ backgroundColor: `#${value}` }}
        key={key}
      >
        {key}
        <div>
          {" "}
          <span className="slot">{" " + actualSlotDict[key]}</span>
        </div>
      </div>
    );
  }

  return <div className="subject-color-grid">{rows}</div>;
}

export default App;
