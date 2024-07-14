import { useLocation } from "react-router-dom";
import { TimeTable } from "./components/TimeTable";
import React from "react";
import { getDataFromCompressedURI } from "./data/impls/URI";
import { getData } from "./data";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const Share = () => {
  let query = useQuery();
  //let version = query.get("v");
  let semId = query.get("sem");
  let data = query.get("data");
  const { subSlotDict, time_table, time_arr } = getData(semId);
  const [timeTable, _] = getDataFromCompressedURI(
    data,
    subSlotDict,
    time_table,
  );

  console.log({ time_table });

  return (
    <TimeTable
      time_table={time_table}
      subTimeSlotDict={timeTable}
      subSlotDict={subSlotDict}
      onSlotTap={() => { }}
      blockedTimeSlots={[]}
      time_arr={time_arr}
    />
  );
};
