import { ReactElement } from "react";
import Button from "react-bootstrap/Button";

// STYLES
import globalStyles from "../../common/globalStyles";

type ButtonProps = {
  text: string;
  icon?: ReactElement;
  onClick: () => void;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
  classes?: string;
};

export default function MyButton({
  text,
  icon,
  onClick,
  style,
  textStyle,
  disabled,
  classes,
}: ButtonProps) {
  return (
    <Button
      size="lg"
      onClick={onClick}
      className={`d-flex justify-content-center align-items-center ${
        classes ? classes : ""
      }`}
      style={style ? { ...style } : { ...globalStyles.buttonPrimary }}
      disabled={disabled ? disabled : false}
    >
      {icon ? icon : null}
      <div
        className="text-uppercase"
        style={
          textStyle
            ? { ...textStyle, marginLeft: icon ? "5px" : "0" }
            : {
                ...globalStyles.buttonPrimaryText,
                marginLeft: icon ? "5px" : "0",
              }
        }
      >
        {text}
      </div>
    </Button>
  );
}
