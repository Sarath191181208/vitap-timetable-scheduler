// Description: This hook is used to store data in local storage and retrieve it when needed
import { useState } from "react";

function useCachedState({ cacheKey, defaultValue }) {
  cacheKey += "V2";
  const [state, setState] = useState(() => {
    const cachedState = localStorage.getItem(cacheKey);
    return cachedState ? JSON.parse(cachedState) : defaultValue;
  });

  const setStateWithCache = (value) => {
    localStorage.setItem(cacheKey, JSON.stringify(value));
    setState(value);
  }

  return [state, setStateWithCache];
}

export { useCachedState };
