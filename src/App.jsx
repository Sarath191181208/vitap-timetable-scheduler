// @ts-check

import Select from "react-select";
import "./css/App.css";
import "./css/checkbox.css";
import { inject } from "@vercel/analytics";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { TutorialSlide, tutorialSlidesData } from "./components/demo";
import { useAppState } from "./hooks/useAppState";
import {
  getSubjectColorDict,
  isEmpty,
  isInDisabledSlots,
} from "./data/utils";

import React from "react";
import { getData } from "./data";
import WarningIcon from "./assets/icons/warning";
import {
  getCompressedURIFromData,
} from "./data/impls/URI";
import { Link } from "react-router-dom";
import { TimeTable } from "./components/TimeTable";
inject();


function App() {
  const semID = "Batch-2021-WIN";
  const { subSlotDict, time_table, time_arr, options, getCreditsFromSlot } =
    getData(semID);

  const {
    selecedSubjectsList,
    errorMesssage,
    timeTable,
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
    customFilterFn,
  } = useAppState({ semID, subSlotDict, getCreditsFromSlot, time_table });

  calculateCredits();

  const getShareableLink = () => {
    const compressedBase16URI = getCompressedURIFromData(
      timeTable,
      subSlotDict,
    );

    return `/share?v=1&sem=${semID}&data=${compressedBase16URI}`;
  }

  const onTimeSlotClick = (/** @type {string} */ timeSlot) => {
    let newBlockedTimeSlots = [];
    let isBlockedTimeSlotRemoved = false;

    // remove the blocked index
    if (blockedTimeSlots.includes(timeSlot)) {
      isBlockedTimeSlotRemoved = true;
      const index = blockedTimeSlots.indexOf(timeSlot);
      newBlockedTimeSlots = blockedTimeSlots.slice();
      newBlockedTimeSlots.splice(index, 1);
    } else {
      // add the timeslot into blocked slots
      newBlockedTimeSlots = [...blockedTimeSlots, timeSlot];
    }

    // update the blocked slots
    setBlockedTimeSlots(newBlockedTimeSlots);

    // update the blocked slot to be a normal slot
    const newPickedSubSlotDict = updateSubSlotTaken(
      selecedSubjectsList,
      newBlockedTimeSlots,
    );

    // updating all the slots in new pickable subjects-slots_list to be not blocked
    const IS_NOT_BLOCKED = 1;
    if (isBlockedTimeSlotRemoved) {
      markBlockedTimeSlotsInplace(
        newPickedSubSlotDict,
        [timeSlot],
        IS_NOT_BLOCKED,
      );
    }

    // update the pickable slots
    setPickedSubSlotDict(newPickedSubSlotDict);

    // generate a new timetable
    submitSubjects(selecedSubjectsList, newPickedSubSlotDict);
  };

  const SubjectSearchBox = (
    <Select
      placeholder="Search the subjects you want to take"
      classNamePrefix="select_subjects"
      defaultValue={selecedSubjectsList}
      onChange={onSubjectSelectChange}
      closeMenuOnSelect={false}
      isMulti
      filterOption={customFilterFn}
      options={options}
      className="basic-multi-select"
    />
  );

  const RefreshButton = (
    <button
      id="refresh-button"
      title="Refresh the Time Table"
      onClick={() => {
        alreadyPickedTimeTableConfigsArray.current.push(timeTable);
        submitSubjects(selecedSubjectsList, pickedSubSlotDict, true);
      }}
    >
      {" "}
      ⟳{" "}
    </button>
  );

  const CantGenerateTimeTableMessage = (
    <div className="error-message">
      <i>
        {" "}
        <WarningIcon width={25} height={25} />
        {" "}
      </i>
      <h2>{errorMesssage}</h2>
    </div>
  );

  return (
    <>
      <div className="subject-selection-controls">
        {SubjectSearchBox}
      </div>

      <div className="action-buttons">
        
      {RefreshButton}

      <Link to={getShareableLink()}> 
        <button id="share-button">
        <svg fill="#ffffff" width="20px" height="20px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M196,216a4.0002,4.0002,0,0,1-4,4H40a12.01312,12.01312,0,0,1-12-12V88a4,4,0,0,1,8,0V208a4.004,4.004,0,0,0,4,4H192A4.0002,4.0002,0,0,1,196,216Zm31.3269-109.78223c.06458-.09668.10865-.20117.16394-.30175a4.01088,4.01088,0,0,0,.20325-.38623,3.933,3.933,0,0,0,.12573-.40528c.0337-.11426.07764-.22314.10108-.34131a4.00772,4.00772,0,0,0,0-1.5664c-.02344-.11817-.06738-.22705-.10095-.34131a3.96592,3.96592,0,0,0-.12586-.40528,3.87558,3.87558,0,0,0-.20337-.38623c-.05517-.10058-.09936-.20507-.16382-.30175a4.001,4.001,0,0,0-.50134-.6128L178.82812,53.17188a3.99957,3.99957,0,0,0-5.65624,5.65624L214.34277,100H168a99.94331,99.94331,0,0,0-96.84961,75.00293,4.00028,4.00028,0,1,0,7.748,1.99414A91.94464,91.94464,0,0,1,168,108h46.34277l-41.17089,41.17188a3.99957,3.99957,0,1,0,5.65624,5.65624l47.99744-47.99755A4.001,4.001,0,0,0,227.3269,106.21777Z"></path> </g>
        </svg> 
        <div>Share
          </div></button>
      </Link>
      </div>

      {isEmpty(timeTable)
        ? <Tutorial />
        : (
          <div className="time-table-container">
            {errorMesssage && CantGenerateTimeTableMessage}
            <TimeTable
              time_table={time_table}
              subTimeSlotDict={timeTable}
              subSlotDict={subSlotDict}
              onSlotTap={onTimeSlotClick}
              blockedTimeSlots={blockedTimeSlots}
              time_arr={time_arr}
            />
            <div>
              <h2>Registered Credits: {calculateCredits()}</h2>
            </div>
          </div>
        )}

      <SubjectCheckBoxes
        subSlotDict={subSlotDict}
        pickedSubSlotDict={pickedSubSlotDict}
        onChange={onSelectBoxChange}
        disabledSlots={blockedTimeSlots}
      />
    </>
  );
}

/**
 * @typedef {Object} SubjectCheckBoxesProps
 * @property {Object} subSlotDict
 * @property {Object} pickedSubSlotDict
 * @property {Function} onChange
 * @property {Array} disabledSlots
 * @param {SubjectCheckBoxesProps} props
 * @returns {import("react").ReactNode}
 */
function SubjectCheckBoxes({
  subSlotDict,
  pickedSubSlotDict,
  onChange,
  disabledSlots,
}) {
  const fillAll = (
    /** @type {boolean} */ checked,
    /** @type {boolean[]} */ isSlotTakenBoolenArray,
    /** @type {string} */ subName,
  ) => {
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
  for (
    const [subName, isSlotTakenBoolenArray] of Object.entries(
      pickedSubSlotDict,
    )
  ) {
    temp_arr.push(
      <div className="subject-checkbox" key={temp_arr.length}>
        <h3
          style={{
            "--data-pre-color": `#${subjectColorDict[subName]}`,
            margin: 0,
            marginTop: "3rem",
          }}
        >
          {subName}
        </h3>
        <div className="select-unselect-div">
          <input
            type="checkbox"
            name="select-all-checkbox"
            id={subName + "Select-All"}
            onChange={(e) => {
              const { checked } = e.target;
              fillAll(checked, isSlotTakenBoolenArray, subName);
            }}
            checked={isSlotTakenBoolenArray.every((isSlotTaken) => isSlotTaken)}
          />
          <label htmlFor={subName}>Select All</label>
          <span className="spacer"></span>
          <input
            type="checkbox"
            name="select-all-checkbox"
            id={subName + "Unselect-all"}
            onChange={(e) => {
              const { checked } = e.target;
              fillAll(!checked, isSlotTakenBoolenArray, subName);
            }}
            checked={isSlotTakenBoolenArray.every(
              (isSlotTaken) => !isSlotTaken,
            )}
          />
          <label htmlFor={subName}>Unselect All</label>
        </div>
        <div id="custom-check-box-grid">
          {isSlotTakenBoolenArray.map((isSlotTaken, i) => (
            <CustomCheckBox
              key={`${subName}-${isSlotTaken}-${i}`}
              // type="checkbox"
              slotLabel={subSlotDict[subName][i]}
              slotId={subSlotDict[subName][i] + subName}
              disabled={isInDisabledSlots(
                subSlotDict[subName][i],
                disabledSlots,
              )}
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
          ))}
        </div>
      </div>,
    );
  }

  return <div className="subject-checkboxes">{temp_arr}</div>;
}

function CustomCheckBox({ onChange, checked, slotLabel, slotId, disabled }) {
  return (
    <div className="checkbox-wrapper-4">
      <input
        className="inp-cbx"
        id={slotId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <label className="cbx" htmlFor={slotId}>
        <span>
          <svg width="12px" height="10px">
            <use></use>
          </svg>
        </span>
        <span>{slotLabel}</span>
      </label>
      <svg className="inline-svg">
        <symbol className="check-4">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </symbol>
      </svg>
    </div>
  );
}

function Tutorial() {
  return (
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
            <TutorialSlide
              key={slide.imageLink}
              imageLink={slide.imageLink}
              text={slide.text}
            />
          );
        })}
      </Carousel>
    </div>
  );
}

export default App;
