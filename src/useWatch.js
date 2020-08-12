import { useEffect, useRef } from 'react';

export default function useWatch(dep, callback) {
  const prev = useRef();
  const prevArray = useRef([]);
  const isInit = useRef(false);
  const isArray = Array.isArray(dep);
  
  useEffect(() => {
    if(!isInit.current) isInit.current = true;
    if(isArray) {
      callback(dep, prevArray.current);
      dep.forEach((e, index) => {
        prevArray.current[index] = e;
      });
    }
    else { 
      callback(dep, prev.current);
      prev.current = dep;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, isArray ? dep : [dep]);
}