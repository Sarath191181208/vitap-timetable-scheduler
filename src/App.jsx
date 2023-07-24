import Select from "react-select";
import "./App.css";
import "./checkbox.css";
import { time_table, time_arr  } from "./data/time_table";
import { subSlotDict, options } from "./data/sub_slot_data";
import { inject } from "@vercel/analytics";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { tutorialSlidesData, TutorialSlide } from "./demo";
import { useAppState } from "./hooks/useAppState";
import { isEmpty, isInDisabledSlots, getActualSlotDict, getSubjectColorDict } from "./data/utils";

inject();


function App() {
  const {
    selecedSubjectsList,
    setSelecedSubjectsList,
    timeTable,
    setTimetable,
    pickedSubSlotDict,
    setPickedSubSlotDict,
    blockedTimeSlots,
    setBlockedTimeSlots,
    alreadyPickedTimeTableConfigsArray,
    onSubjectSelectChange,
    calculateCredits,
    submitSubjects,
    onSelectBoxChange,
    updateSubSlotTaken,
    markBlockedTimeSlotsInplace,
    customFilterFn
  } = useAppState();

  calculateCredits();

  return (
    <>
      <div className="subject-selection-controls">
        <Select
          defaultValue={selecedSubjectsList}
          onChange={onSubjectSelectChange}
          closeMenuOnSelect={false}
          isMulti
          filterOption={customFilterFn}
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

          <Carousel
            showArrows={true}
            autoPlay={true}
            infiniteLoop={true}
            className="carousel-container"
            transitionTime={500}
          >
            {tutorialSlidesData.map((slide) => {
              return (
                <TutorialSlide imageLink={slide.imageLink} text={slide.text} />
              );
            })}
          </Carousel>
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
          <div>
            <h2>Registered Credits: {calculateCredits()}</h2>
          </div>
        </div>
      )}

      <SubjectCheckBoxes
        pickedSubSlotDict={pickedSubSlotDict}
        onChange={onSelectBoxChange}
        disabledSlots={blockedTimeSlots}
      />
    </>
  );
}

function SubjectCheckBoxes({ pickedSubSlotDict, onChange, disabledSlots }) {
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
        <div id="custom-check-box-grid">
          {isSlotTakenBoolenArray.map((isSlotTaken, i) => (
            <CustomCheckBox
              label={subSlotDict[subName][i]}
              disabled={isInDisabledSlots(
                subSlotDict[subName][i],
                disabledSlots
              )}
              checked={isSlotTaken}
              key={`${subName}-${i}`}
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
          ))}
        </div>
      </div>
    );
  }

  return <div className="subject-checkboxes">{temp_arr}</div>;
}

function CustomCheckBox({ onChange, checked, label, disabled }) {
  return (
    <div className="checkbox-wrapper-4">
      <input
        className="inp-cbx"
        id={label}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e)}
      />
      <label className="cbx" htmlFor={label}>
        <span>
          <svg width="12px" height="10px">
            <use></use>
          </svg>
        </span>
        <span>{label}</span>
      </label>
      <svg className="inline-svg">
        <symbol id="check-4">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </symbol>
      </svg>
    </div>
  );
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
