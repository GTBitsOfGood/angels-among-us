import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number): [T, boolean] {
  const [val, setVal] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsUpdating(true);
    const timerId = setTimeout(() => {
      setVal(value);
      setIsUpdating(false);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);

  return [val, isUpdating];
}
