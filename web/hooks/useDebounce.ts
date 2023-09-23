import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number): T {
  const [val, setVal] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setVal(value);
    }, delay);
    return () => clearTimeout(timerId);
  }, [value, delay]);

  return val;
}
