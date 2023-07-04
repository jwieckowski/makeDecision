import React, { FocusEvent } from "react";
import Form from "react-bootstrap/Form";
// STYLES
import globalStyles from "../../common/globalStyles";

type InputProps = {
  type: string;
  value: string | number;
  placeholder?: string;
  onChange: (e: any) => void;
  onBlur?: (e: FocusEvent<any>) => void;
  label?: string;
  labelStyle?: any;
  style?: any;
  disabled?: boolean;
};

export default function Input({
  type,
  value,
  placeholder,
  onChange,
  onBlur,
  label,
  labelStyle,
  style,
  disabled,
}: InputProps) {
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
        size="sm"
        style={style ? { ...style } : { ...globalStyles.textInput }}
        type={type}
        value={value}
        placeholder={placeholder ? placeholder : ""}
        onChange={onChange}
        disabled={disabled ? disabled : false}
        onBlur={(e) => (onBlur ? onBlur(e) : () => {})}
      />
    </Form.Group>
  );
}
