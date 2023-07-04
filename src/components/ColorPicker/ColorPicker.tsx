import Form from "react-bootstrap/Form";

// STYLES
import globalStyles from "../../common/globalStyles";

type ColorPickerProps = {
  value: string;
  onChange: (e: any) => void;
  label?: string;
  style?: any;
  labelStyle?: any;
};

export default function ColorPickerExample({
  value,
  onChange,
  label,
  style,
  labelStyle,
}: ColorPickerProps) {
  return (
    <Form.Group style={{ ...globalStyles.inputForm }}>
      <Form.Label
        htmlFor="colorInput"
        style={
          labelStyle ? { ...labelStyle } : { ...globalStyles.textInputLabel }
        }
      >
        {label}
      </Form.Label>
      <Form.Control
        type="color"
        id="colorInput"
        defaultValue="#FFF"
        title="Choose your color"
        style={style ? { ...style } : { margin: 0, padding: 5 }}
        onChange={onChange}
      />
    </Form.Group>
  );
}
