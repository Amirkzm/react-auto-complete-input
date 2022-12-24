import { MutableRefObject, useEffect, useState } from "react";

interface Coords {
  x: number;
  y: number;
}

const useStickAnchor = (anchor: MutableRefObject<HTMLInputElement | null>) => {
  const [coords, setCoords] = useState<Coords>({ x: 0, y: 0 });
  const [anchorWidth, setAnchorWidth] = useState<number>(0);

  useEffect(() => {
    const topOffset =
      anchor.current?.offsetTop! + anchor.current?.offsetHeight!;
    const leftOffset = anchor.current?.offsetLeft!;
    const width = anchor.current?.offsetWidth!;

    setCoords({ x: leftOffset, y: topOffset });
    setAnchorWidth(width);
  }, [anchor]);

  return { coords, anchorWidth };
};

export default useStickAnchor;
