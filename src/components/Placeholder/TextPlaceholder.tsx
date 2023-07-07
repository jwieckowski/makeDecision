import React from "react";
import Placeholder from "react-bootstrap/Placeholder";

type TextPlaceholderProps = {
  style?: any;
};

export default function TextPlaceholder({ style }: TextPlaceholderProps) {
  return (
    <Placeholder as="p" animation="glow">
      {style !== undefined ? (
        <Placeholder style={style} />
      ) : (
        <Placeholder className="w-100" />
      )}
    </Placeholder>
  );
}
