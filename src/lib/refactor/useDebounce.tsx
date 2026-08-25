import { useCallback, useRef } from "react";
import { debounce } from "../utils";

type DebounceProps = {
  f: (...args: any) => any;
  d: number;
  deps: any[];
};

export const useDebounce = ({ f, d, deps }: DebounceProps) => {
  const debouncedRef = useRef<ReturnType<typeof debounce>>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((...args: any[]) => {
    if (!debouncedRef.current) {
      debouncedRef.current = debounce(f, d);
    }
    debouncedRef.current(...args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
