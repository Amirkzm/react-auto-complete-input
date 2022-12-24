import React from "react";
import { Fragment } from "react";

// Needed if the target includes ambiguous characters that are valid regex operators.
const escapeRegex = (v: string) =>
  v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

const highlightWord = (source: string, target: string, key: string) => {
  const res: any[] = [];
  const regex = new RegExp(escapeRegex(target), "gi");
  if (!target || target === " ") {
    return source;
  }

  let lastOffset = 0;

  // Uses replace callback, but not its return value

  source.replace(regex, (val, offset) => {
    // Push both the last part of the string, and the new part with the highlight
    res.push(
      source.substring(lastOffset, offset),
      // Replace the string with JSX or anything.
      <b>{val}</b>
    );
    lastOffset = offset + val.length;

    return val;
  });

  // Push the last non-highlighted string
  res.push(source.substring(lastOffset));

  const jsxResultMatchBoldedText = (
    <span>
      {res.map((item, index) => {
        return <Fragment key={index}>{item}</Fragment>;
      })}
    </span>
  );
  return jsxResultMatchBoldedText;
};

export default highlightWord;
