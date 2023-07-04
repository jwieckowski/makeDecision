import React, { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";

// STYLES
import globalStyles from "../../common/globalStyles";

type Items = {
  label: string;
  value: string;
};

type SelectProps = {
  items: Items[];
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>, val?: number) => void;
  label?: string;
  style?: any;
  labelStyle?: any;
};

export default function Select({
  items,
  value,
  onChange,
  label,
  style,
  labelStyle,
}: SelectProps) {
  return (
    <Form.Group controlId="formGroup" style={{ ...globalStyles.inputForm }}>
      {label ? (
        <Form.Label
          style={
            labelStyle ? { ...labelStyle } : { ...globalStyles.textInputLabel }
          }
        >
          {label}
        </Form.Label>
      ) : null}
      <Form.Control
        as="select"
        value={value}
        onChange={onChange}
        style={
          style ? { ...style } : { margin: 0, padding: 5, textAlign: "center" }
        }
      >
        {items.map((item, index) => {
          return (
            <option key={`select-${index}`} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
}
