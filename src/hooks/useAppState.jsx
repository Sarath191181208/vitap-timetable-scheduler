import { useCachedState } from "./useCachedState";
import { useRef } from "react";
import { pick_slot } from "../pick_slot";
import { getActualSlotDict, getMaskedSubSlotDict } from "../data/utils";
import { subSlotDict } from "../data/sub_slot_data";
import { getCreditsFromSlot } from "../data/time_table";
import { is_same_slot } from "../data/time_table";

function useAppState() {
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
    if (!isTrue) {
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

  function calculateCredits() {
    const actualSlotDict = getActualSlotDict(timeTable, subSlotDict);
    const creditsSum = Object.entries(actualSlotDict).reduce(
      (acc, slotNameSlotTuple) => {
        const [slotName, slot] = slotNameSlotTuple;
        const subName = slotName.split("-")[0];
        const isSTS = slotName.startsWith("STS");
        const credit = isSTS ? 1 : getCreditsFromSlot(slot);
        return acc + credit;
      },
      0
    );
    return creditsSum;
  }

  const customFilterFn = (option, searchText) => {
    onSelectBoxChange;
    function convertToShortform(longForm) {
      let words = longForm.replaceAll(" ", "-").split("-"); // label is of the form CSE1001-Data Mining
      words.shift(); // removing the course code
      return words
        .map((word) => {
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

  return {
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
    onSelectBoxChange,
    submitSubjects,
    updateSubSlotTaken,
      markBlockedTimeSlotsInplace,
    customFilterFn,
  };
}

export { useAppState };