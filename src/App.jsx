import { useState } from "react";
import Select from "react-select";
import "./App.css";
import lab_data from "./data/lab_data";
import theoryData from "./data/theory_data";
import { time_table, time_arr } from "./data/time_table";
import { pick_slot } from "./pick_slot";

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

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function App() {
  const [selecedSubjectsList, setSelecedSubjectsList] = useState([]);
  const [timeTable, setTimetable] = useState({});
  const onSubjectSelectChange = (e) => {
    setSelecedSubjectsList(e);
    if (e.length === 0) return;
    submitSubjects(e);
  };

  const submitSubjects = (selecedSubjectsList) => {
    if (selecedSubjectsList.length === 0) {
      alert("Please select at least one subject");
      return;
    }

    const selectedSubjects = selecedSubjectsList.map(
      (subject) => subject.value
    );
    console.log(selectedSubjects);

    const tt = {};
    const isTrue = pick_slot(selectedSubjects, tt, subSlotDict);
    if (isTrue) {
      console.log("Time Table: ", tt);
      setTimetable(tt);
      console.log("Time Table: ", timeTable);
    } else {
      console.log("Not possible");
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

        {/* <button onClick={() => submitSubjects(selecedSubjectsList)}>Submit</button> */}
      </div>

      {isEmpty(timeTable) ? (
        <div className="tutorial">
          <h2>How to use?</h2>
          <p>
            1. Select the subjects you want to take in the dropdown menu you can
            select multiple subjects from the same box
          </p>
          <p>2. Click on the submit button.</p>
          <p>3. You will see the time table.</p>
          <p>4. Hover over the slot to know the course and it's code</p>
        </div>
      ) : (
        <div className="time-table-container">
          <TimeTable subSlotDict={timeTable} />
        </div>
      )}
    </>
  );
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
