import { useEffect, useState } from "react";

export default function useDebounce(value: any, delay: number) {
  const [val, setVal] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setVal(value);
    }, delay);
    return () => clearTimeout(timerId);
  }, [value, delay]);

  return val;
}
