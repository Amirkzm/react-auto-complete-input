import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import "./AutoCompleteInput.css";

import useSuggestion from "../hooks/useSuggestion";
import useStickAnchor from "../hooks/useStickAnchor";
import useSuggestionItems from "../hooks/useSuggestionItems";

interface AutoCompleteInputProps
  extends Omit<React.ComponentPropsWithRef<"input">, "onChange"> {
  addressGenerator: (query: string) => string;
  transformResult: (response: any) => any[];
  getLabel: (chosenItem: any) => string;
  value: any;
  userInputValue: string;
  renderFunction: (parameters: RenderFunctionParams) => React.ReactNode;
  wrapperProps?: React.ComponentPropsWithRef<"div">;
  placeholder?: string;
  keyGenerator?: (item: any, index: number) => any;
  outerWrapperRef?: React.MutableRefObject<HTMLDivElement | null>;
  innerWrapperRef?: React.MutableRefObject<HTMLDivElement | null>;
  onChange?: (selectedItem: any) => any;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  freeSolo?: boolean;
  InputComponent?: React.ElementType;
  inputComponenProps?: object;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  itemHeight: number;
  maxSuggestionListHeight?: number;
}

export interface RenderFunctionParams {
  data: any;
  getLabel: (chosenItem: any) => string;
  props: RenderFunctionProps;
  boldedMatchText: React.ReactNode;
}

interface RenderFunctionProps {
  onClick: () => void;
  key?: any;
  style?: any;
  className: string;
  onMouseEnter: React.MouseEventHandler<HTMLDivElement>;
}

const AutoCompleteInput = forwardRef(
  (props: AutoCompleteInputProps, ref: React.Ref<HTMLInputElement | null>) => {
    const {
      addressGenerator,
      transformResult = (response) => response,
      renderFunction,
      getLabel = (chosenItem) => chosenItem,
      keyGenerator = (item, index) => index,
      value,
      placeholder = "Enter your text",
      wrapperProps,
      onChange,
      onInputChange,
      freeSolo = true,
      InputComponent = "input",
      inputComponenProps,
      userInputValue,
      outerWrapperRef,
      innerWrapperRef,
      loadingComponent = <p>Loading suggestions!</p>,
      errorComponent = <p>Something went wrong with receiving suggestions!</p>,
      itemHeight,
      maxSuggestionListHeight = 400,
      ...rest
    } = props;

    const inputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => inputRef.current);
    const { coords, anchorWidth } = useStickAnchor(inputRef);

    console.log(userInputValue);
    console.log(getLabel(value));

    const finalInputValue = value ? getLabel(value) : userInputValue;

    const {
      showSuggestions,
      setShowSuggestions,
      suggestionsList,
      isLoading,
      isError,
      fetchSuggestions,
    } = useSuggestion(
      innerWrapperRef,
      inputRef,
      transformResult,
      addressGenerator,
      finalInputValue
    );

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      onInputChange?.(e);
      if (freeSolo) {
        onChange?.(e.target.value);
      }
      if (e.target.value === "" || e.target.value === " ") {
        setShowSuggestions(false);
      } else {
        fetchSuggestions(e.target.value);
      }
    };

    const selectSuggestionHandler = useCallback(
      (item: any) => {
        setShowSuggestions(false);
        onChange?.(item);
      },
      [onChange, setShowSuggestions]
    );

    const keyboardHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (suggestionsList.length > 0) {
        if (
          e.code === "ArrowDown" &&
          hoveredIndex < suggestionsList.length - 1
        ) {
          setHoveredIndex((prev) => prev + 1);
        } else if (e.code === "ArrowUp" && hoveredIndex >= 1) {
          setHoveredIndex((prev) => prev - 1);
        } else if (e.code === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          selectSuggestionHandler(suggestionsList[hoveredIndex]);
          setHoveredIndex(0);
        }
      }
    };

    const [suggestions, { hoveredIndex, setHoveredIndex }] = useSuggestionItems(
      {
        suggestionsList,
        renderFunction,
        getLabel,
        selectSuggestionHandler,
        finalInputValue,
        keyGenerator,
      }
    );

    return (
      <div
        {...wrapperProps} //TODO ask how it doesn't overwrite my className
        className={`aciRoot ${wrapperProps?.className}`}
        ref={outerWrapperRef}
      >
        <InputComponent
          value={finalInputValue}
          onChange={inputChangeHandler}
          placeholder={placeholder}
          ref={inputRef}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            keyboardHandler(e)
          }
          onFocus={() => setShowSuggestions(true)}
          {...inputComponenProps}
          {...rest}
        />
        {showSuggestions && (
          <div
            className="aciSuggetionsWrapper"
            style={{
              top: coords.y,
              left: coords.x,
              width: anchorWidth,
              height: suggestionsList.length * itemHeight,
              maxHeight: maxSuggestionListHeight,
            }}
            ref={innerWrapperRef}
          >
            {isError && errorComponent}
            {suggestions}
            {isLoading && loadingComponent}
          </div>
        )}
      </div>
    );
  }
);

export default AutoCompleteInput;
