# react-auto-complete

## Description

A search auto-completer with dynamic backend support.

# Demo

Add demo here

## Table of Contents

1. [Main Features ](#features)
2. [Installation ](#installation)
3. [Basic Usage ](#usage)
4. [Props ](#props)
5. [License ](#license)

## Features

- Provide list of all suggestions
- Accepts fully customized component as suggestion item
- Accepts input component as input element from MUI,Bootstrap or any other library even your own customized component
- Suggestions are highlighted and can be navigated with arrow keys or by mouse
- Bolding already entered text that match any part of suggestion list
- Accept your component to handle error and loading states
- Ability to controll refs and also forward passed ref
- Full controll on each part of component for styling purpose
- Pass through arbitrary props to the input (e.g. placeholder, type, onChange, onBlur, or any other)
- Support Free-solo mode
- And more yet to discover!

## Installation

Install by npm:

```
npm install amirkzm/...
```

Or:

```
yarn add amirkzm/...
```

## Usage

```typescript
import React, { useState } from "react";
import AutoCompleteInput, {
  RenderFunctionParams,
} from "@amirkzm/name-of-package";
import TextField from "@mui/material/TextField";

//Transform the returned reponse from server to an array (array of suggestions)
const transformResult = (response: any) => {
  return response.data;
};

// Extract a displayable value for representation purpose from a suggestion
const getLabel = (item: any) => {
  if (typeof item === "string") {
    return item;
  } else {
    return item.fact;
  }
};

// Generating address for entered query
const addressGenerator = (query: string) => {
  return "some url";
};

// Display each suggestion item. It receive data of selected suggestion, getLabel function, props (including onClick,onMouseEnter,key, className and style)
//and finally boldedMatchText that contains suggestion display text with bolded matched entered value.
//
const renderFunction = ({
  data,
  getLabel,
  props,
  boldedMatchText,
}: RenderFunctionParams) => {
  return <div {...props}>{boldedMatchText}</div>;
};

function App() {
  const [selectedItem, setSelectedItem] = useState<any>();
  const [value, setValue] = useState<string>("");

  // This function will be called everytime user select a suggestion
  const onChange = (selectedItem: any) => {
    setSelectedItem(newValue);
    setValue(getLabel(newValue));
  };

  // This will be called everytime user enter a character
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <AutoCompleteInput
        renderFunction={renderFunction}
        transformResult={transformResult}
        addressGenerator={addressGenerator}
        onChange={onChange}
        onInputChange={inputChangeHandler}
        userInputValue={value}
        value={selectedItem}
        freeSolo
        getLabel={getLabel}
        keyGenerator={keyGenerator}
        itemHeight={50}
        InputComponent={TextField}
      />
    </div>
  );
}
```

## Props

| Props                   |   Types   | Required | Description                                                                                                                                                                                   |
| ----------------------- | :-------: | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| renderFunction          | Function  | ✓        | React component responsible for rendering the each individual item of the suggestion's list.                                                                                                  |
| addressGenerator        | Function  | ✓        | A function that receives query entered by user and generate the address for that input to fetch data from.                                                                                    |
| getLabel                | Function  | ✓        | This function will be used when we want to show string representation of an suggestion item received from server.                                                                             |
| transformResult         | Function  | ✓        | This function will be used to extract or (transform server's response) an array of suggestions from the server response.                                                                      |
| value                   |    Any    | ✓        | Use this if you want to pass your own item (object, string or anything else) to the component. If you use this the input field will be getLabel(item) no matter what user has typed already.  |
| userInputValue          |  String   | ✓        | The input value from the user that should be displayed in the input field.                                                                                                                    |
| itemHeight              |  Number   | ✓        | Height of each suggestion item.                                                                                                                                                               |
| loadingElement          | ReactNode |          | An Optional ReactNode element if we want to show user as loading                                                                                                                              |
| InputComponent          |  Element  |          | An input component to be used as the main input element. default is HTML input tag.                                                                                                           |
| errorElement            | ReactNode |          | An Optional ReactNode element if we want to show user as error                                                                                                                                |
| keyGenerator            | Function  |          | A function to generate key. It accepts a suggested item and the index and return a key.                                                                                                       |
| onChange                | Function  |          | This function will be called when an item has been selected from suggestion's list or when user types a character(only if freeSolo is true otherwise it won't be called when user types)      |
| onInputChange           | Function  |          | This function will be called when user types a character.                                                                                                                                     |
| wrapperProps            |  Object   |          | Pass through arbitrary props to the root wrapper of the component.                                                                                                                            |
| placeholder             |  String   |          | Placeholder for the component.                                                                                                                                                                |
| outerWrapperRef         |    ref    |          | This ref prop target the root div.                                                                                                                                                            |
| innerWrapperRef         |    ref    |          | This ref prop target the inner(suggestions div) div.                                                                                                                                          |
| freeSolo                |  Boolean  |          | Use this if you want user can have the ability of not choosing any suggestion and use it's own entered input. Default is true.                                                                |
| inputComponenProps      |  Object   |          | Pass through arbitrary props to the input. It is useful when you define your own component as input component(e.g. MUI textField or your own customized components with specified props set). |
| maxSuggestionListHeight |  number   |          | Max height of suggestion list.                                                                                                                                                                |

#### renderFunction(Required)

This function is reposible to display each suggestion item. It receives:

- data : the entire data received from server for this item. It's actually the corresponding item from suggestion list.
- getLabel : this function receives an item as input and display string representation of that item.
- props : including:
  - onClick
  - key
  - style
  - classsName
  - onMouseEnter
- boldedMatchText : resresents each suggestions with entered text as bold

```typescript
const renderFunction = ({
  data,
  getLabel,
  props,
  boldedMatchText,
}: RenderFunctionParams) => {
  const { onClick, key, style, className, onMouseEnter } = props; // if you want to use each one seperatedly
  return <div {...props}>{boldedMatchText}</div>;
  //return <div {...props}>{getLabel(data)}</div> if you don't want to use boldMatchedText
};
```

# license

MIT
