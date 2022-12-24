import React, { useCallback, useEffect, useRef, useState } from "react";
import useFetch from "./useLazyFetch";

type InnerWrapperRefType =
  | React.MutableRefObject<HTMLDivElement | null>
  | undefined;
type InputRefType = React.MutableRefObject<HTMLInputElement | null>;
type TransformResultType = (response: any) => any[];
type addressGeneratorType = (query: string) => string;

const useSuggestion = (
  innerWrapperRef: InnerWrapperRefType,
  inputRef: InputRefType,
  transformResult: TransformResultType,
  addressGenerator: addressGeneratorType,
  finalInputValue: string
) => {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [suggestionsList, setSuggestionsList] = useState<any[]>([]);
  const timeoutID = useRef<NodeJS.Timeout>();

  const { isLoading, isError, fetchData } = useFetch();

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (e.target !== innerWrapperRef?.current) {
        if (
          e.target === inputRef.current ||
          inputRef.current?.contains(e.target as Node)
        ) {
          setShowSuggestions((prev) => (prev === true ? prev : !prev));
        } else {
          setShowSuggestions(false);
        }
      }
    };
    window.addEventListener("click", (e) => clickHandler(e));
    return () => window.removeEventListener("click", clickHandler);
  }, [innerWrapperRef, inputRef]);

  const fetchSuggestions = useCallback(
    (query: string) => {
      setShowSuggestions(true);
      clearTimeout(timeoutID.current);
      timeoutID.current = setTimeout(async () => {
        const addressToFetch = addressGenerator(finalInputValue);
        const rawData = await fetchData(addressToFetch);
        setSuggestionsList([...transformResult(rawData)]);
      }, 500);
    },
    [fetchData, transformResult, addressGenerator, finalInputValue]
  );

  return {
    showSuggestions,
    suggestionsList,
    setShowSuggestions,
    isLoading,
    isError,
    fetchSuggestions,
  };
};

export default useSuggestion;
