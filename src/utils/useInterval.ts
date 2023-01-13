import { useRef, useEffect } from 'react';

export function useInterval(callback: any, delay: any) {
  const savedCallback = useRef(Function);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      // eslint-disable-next-line prefer-const
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
