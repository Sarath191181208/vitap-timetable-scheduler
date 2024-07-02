import React from "react";

import hover from "./assets/screenshots/hover.png";
import searchbox from "./assets/screenshots/searchbox.png";
import slotpicker from "./assets/screenshots/slotpicer.png";
import block_slots from "./assets/screenshots/block_slots.png";
import "./css/tutorial.css";

const tutorialSlidesData = [
  {
    imageLink: searchbox,
    text: "Search for the subject you want to add to your timetable.",
  },
  {
    imageLink: slotpicker,
    text: "Select the slot you want to add to your timetable. This is only available for subjects with multiple slots.",
  },
  {
    imageLink: hover,
    text: "Hover over the slot to see the subject name.",
  },
  {
    imageLink: block_slots,
    text: "Tap on the slot to block the slot no subject can use that slot.",
  },
];

const TutorialSlide = ({ imageLink, text }) => {
  return (
    <div className="container">
      <h3>{text}</h3>
      <img src={imageLink} alt="" />
    </div>
  );
};

export { tutorialSlidesData, TutorialSlide };
