import React, { useMemo, useState } from "react";
import highlightWord from "../utils/highlightWord";

export interface UseSuggestionsParams {
  suggestionsList: any[];
  renderFunction: (parameters: RenderFunctionParams) => React.ReactNode;
  getLabel: (chosenItem: any) => string;
  selectSuggestionHandler: (item: any) => void;
  finalInputValue: string;
  keyGenerator: (item: any, index: number) => any;
}

interface RenderFunctionParams {
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

type UseSuggestionsResult = [
  React.ReactNode[],
  {
    hoveredIndex: number;
    setHoveredIndex: React.Dispatch<React.SetStateAction<number>>;
  }
];

const useSuggestionItems = (
  params: UseSuggestionsParams
): UseSuggestionsResult => {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const {
    suggestionsList,
    renderFunction,
    getLabel,
    selectSuggestionHandler,
    finalInputValue,
  } = params;
  const suggestions = useMemo(
    () =>
      suggestionsList.map((item, index) => {
        const fullSuggestedText = getLabel(item);
        return renderFunction({
          data: item,
          getLabel,
          props: {
            onClick: () => selectSuggestionHandler(item),
            key: index,
            className: `aciItem ${hoveredIndex === index ? "hoveredItem" : ""}`,
            onMouseEnter: () => setHoveredIndex(index),
          },
          boldedMatchText: highlightWord(
            fullSuggestedText,
            finalInputValue,
            getLabel(item)
          ),
        });
      }),
    [
      suggestionsList,
      finalInputValue,
      hoveredIndex,
      getLabel,
      renderFunction,
      selectSuggestionHandler,
    ]
  );
  return [suggestions, { hoveredIndex, setHoveredIndex }];
};

export default useSuggestionItems;
