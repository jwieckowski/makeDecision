import React from "react";
import Placeholder from "react-bootstrap/Placeholder";

type BoxPlaceholderProps = {
  height: number;
  width: number;
};

export default function BoxPlaceholder({ width, height }: BoxPlaceholderProps) {
  return (
    <Placeholder
      as="div"
      animation="glow"
      style={{ width: width, height: height }}
    >
      <Placeholder className="w-100 h-100" />
    </Placeholder>
  );
}
