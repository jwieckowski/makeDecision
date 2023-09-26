import React from "react";

import Form from "react-bootstrap/Form";

// STYLES
import styles from "./styles.js";

type CheckboxProps = {
  id: string;
  label: string;
  value: boolean;
  onChange: (e: any) => void;
  style?: any;
};

function Checkbox({ id, label, value, onChange, style }: CheckboxProps) {
  return (
    <Form.Check
      style={style ? { ...style } : { ...globalStyles.checkbox }}
      type="checkbox"
      id={id}
      label={label}
      checked={value}
      onChange={onChange}
    />
  );
}

export default Checkbox;
