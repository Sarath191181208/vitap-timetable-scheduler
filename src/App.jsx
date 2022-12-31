import { useState } from "react";
import Select from "react-select";
import "./App.css";
import { time_table, time_arr } from "./data/time_table";
import { pick_slot } from "./pick_slot";
import { subSlotDict, options } from "./data/sub_slot_data";

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

function App() {
  const [selecedSubjectsList, setSelecedSubjectsList] = useState([]);
  const [timeTable, setTimetable] = useState({});
  const [pickedSubSlotDict, setPickedSubSlotDict] = useState({});

  const onSubjectSelectChange = (e) => {
    setSelecedSubjectsList(e);
    if (e.length === 0) return;
    const newPickedSubSlotDict = updateSubSlotTaken(e);
    submitSubjects(e, newPickedSubSlotDict);
  };

  const updateSubSlotTaken = (selecedSubjectsList) => {
    const _subIsSlotTakenDict = {};
    for (const subjectOptions of selecedSubjectsList) {
      const { value: subName } = subjectOptions;
      if (!(subName in pickedSubSlotDict))
        _subIsSlotTakenDict[subName] = new Array(subSlotDict[subName].length).fill(1); 
      else _subIsSlotTakenDict[subName] = pickedSubSlotDict[subName];
    }
    setPickedSubSlotDict(_subIsSlotTakenDict);
    return _subIsSlotTakenDict;
  }

  const onSelectBoxChange = (_pickedSubSlotDict) => {
      console.log("onSelectBoxChange: ")
      setPickedSubSlotDict(_pickedSubSlotDict);
      submitSubjects(selecedSubjectsList, _pickedSubSlotDict);
    };

  const submitSubjects = (selecedSubjectsList, _pickedSubSlotDict) => {
    if (selecedSubjectsList.length === 0) {
      alert("Please select at least one subject");
      return;
    }

    const selectedSubjects = selecedSubjectsList.map(
      (subject) => subject.value
    );

    const tt = {};
    const maskedSubSlotDict = getMaskedSubSlotDict(_pickedSubSlotDict , subSlotDict);
    const isTrue = pick_slot(selectedSubjects, tt, maskedSubSlotDict);
    if (isTrue) {
      setTimetable(tt);
      console.log(tt);
    } else {
      alert("No possible time table");
    }
  };

  return (
    <>
      <div className="subject-selection-controls">
        <Select
          onChange={onSubjectSelectChange}
          closeMenuOnSelect={false}
          isMulti
          options={options}
          className="basic-multi-select"
        />

        {/* <button onClick={() => submitSubjects(selecedSubjectsList, pickedSubSlotDict)}>Submit</button> */}
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
          <TimeTable subSlotDict={timeTable} />
        </div>
      )}
      <SubjectCheckBoxes pickedSubSlotDict={ pickedSubSlotDict } onChange={ onSelectBoxChange } />
    </>
  );
}

function SubjectCheckBoxes({ pickedSubSlotDict, onChange }) {
  const temp_arr = [];
  for (const [subName, isSlotTakenBoolenArray] of Object.entries(pickedSubSlotDict)) {
    temp_arr.push(
      <div className="subject-checkbox" key={subName}>
        <h3>{subName}</h3>
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
                const newDict = { ...pickedSubSlotDict, [subName]: placeHolder };
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

function TimeTable({ subSlotDict }) {
  const slotSubjectDict = {};
  for (const [key, value] of Object.entries(subSlotDict)) {
    // iterate the value arr
    for (const slot of value) {
      slotSubjectDict[slot] = key;
    }
  }

  const subjectColorDict = {};
  for (const [subj, value] of Object.entries(subSlotDict)) {
    let clr = localStorage.getItem(subj);
    if (clr == null) {
      clr = Math.floor(Math.random() * 16777215).toString(16);
      localStorage.setItem(subj, clr);
    }
    subjectColorDict[subj] = clr;
  }

  const rows = [];

  for (const [key, value] of Object.entries(time_table)) {
    rows.push(
      <tr key={key}>
        <td>{key}</td>
        {value.map((slot) =>
          slot in slotSubjectDict ? (
            <td
              key={slot}
              data-hover={slotSubjectDict[slot]}
              style={{
                backgroundColor: `#${subjectColorDict[slotSubjectDict[slot]]}`,
              }}
            >
              {slot}
            </td>
          ) : (
            <td key={slot}>{slot}</td>
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
      <ColorDict subjectColorDict={subjectColorDict} />
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

function ColorDict({ subjectColorDict }) {
  const rows = [];
  for (const [key, value] of Object.entries(subjectColorDict)) {
    rows.push(
      <div className="subject-block" style={{ backgroundColor: `#${value}` }}>
        {key}
      </div>
    );
  }

  return <div className="subject-color-grid">{rows}</div>;
}

export default App;
