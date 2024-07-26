// @ts-check
import * as React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

export function SubjectSearchBox(
  { selecedSubjectsList, options, onSubjectSelectChange, subSlotDict },
) {
  const { updateBackspace, resetBackspace, canDeleteItem } =
    useAccidentalBackspace();
  return (
    <Select
      placeholder="Search the subjects you want to take"
      defaultValue={selecedSubjectsList}
      value={selecedSubjectsList}
      onChange={(e, actionMeta) => {
        if (actionMeta.action == "pop-value" && !canDeleteItem()) {
          updateBackspace();
          return;
        }
        resetBackspace();
        const isSubjectAdded = actionMeta.action == "select-option";
        let newSubjects = e;
        // find courses with same course code and add then like lab
        if (isSubjectAdded) {
          const subjects = getCoursesWithSameCode(
            e, // @ts-ignore
            subSlotDict,
            selecedSubjectsList,
          );

          // include the subjects check if null as well
          const newOptions = options.filter((
            /** @type {{ label: string; }} */ opt,
          ) => subjects.includes(opt.label));

          newSubjects = [...selecedSubjectsList, ...newOptions];
        }
        onSubjectSelectChange(newSubjects);
      }}
      closeMenuOnSelect={false}
      isMulti
      filterOption={customFilterFn}
      options={options}
      className="basic-multi-select"
      classNamePrefix="select_subjects"
      components={animatedComponents}
    />
  );
}

function useAccidentalBackspace() {
  const popValueCount = React.useRef(0);
  const updateBackspace = () => {
    popValueCount.current = 1;
  };

  const resetBackspace = () => {
    popValueCount.current = 0;
  };

  const canDeleteItem = () => {
    // This represents only if you press the backspace key twice
    return popValueCount.current == 1;
  };

  return { updateBackspace, resetBackspace, canDeleteItem };
}

const customFilterFn = (
  /** @type {{ data: { label: string; value: string; }; }} */ option,
  /** @type {string} */ searchText,
) => {
  /**
   * @param {string} longForm
   */
  function convertToShortform(longForm) {
    // @ts-ignore
    let words = longForm.replaceAll(" ", "-").split("-"); // label is of the form CSE1001-Data Mining
    words.shift(); // removing the course code
    return words
      .map((/** @type {string} */ word) => {
        if (word.length === 0) return "";
        const trimedWord = word[0].trim();
        if (trimedWord == trimedWord.toUpperCase()) {
          return trimedWord.toUpperCase();
        }
        return "";
      })
      .join("");
  }

  const label = option.data.label.toLowerCase();
  const value = option.data.value.toLowerCase();
  const searchTextLowerCase = searchText.toLowerCase();
  if (
    label.includes(searchTextLowerCase) ||
    value.includes(searchTextLowerCase)
  ) {
    return true;
  }
  const shortform = convertToShortform(option.data.label);
  return shortform.includes(searchText.toUpperCase());
};

/**
 * Find courses with same course code inplace
 * @param {{label: string;value: string;}[]} e
 * @param {{courseName: string[];}} subSlotDict
 * @param {{ label: string; }[]} selectedSubjectList
Useful for fetching lab given theory or vice versa
 */
const getCoursesWithSameCode = (
  e,
  subSlotDict,
  selectedSubjectList,
) => {
  // if e is none return
  if (e.length == 0) return [];

  // get the course code for last added element
  const lastIndex = e.length - 1;
  const courseObj = e[lastIndex];
  const courseName = courseObj.label;
  const courseCode = courseName.split("-")[0];

  // find the course remaining course with the same code and not added
  return Object.keys(subSlotDict).filter((
    courseName,
  ) => (courseName.startsWith(courseCode) &&
    // check if this course is already in picked subjects
    !selectedSubjectList.some((
      /** @type {{ label: string; }} */ selectedSubjObj,
    ) => selectedSubjObj.label == courseName))
  );
};
