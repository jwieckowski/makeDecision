import { ReactElement } from "react";
import Button from "react-bootstrap/Button";

// STYLES
import globalStyles from "../../common/globalStyles";

type IconButtonProps = {
  icon: ReactElement;
  onClick: () => void;
  style?: any;
};

export default function IconButton({ icon, onClick, style }: IconButtonProps) {
  return (
    <Button
      size="lg"
      onClick={onClick}
      className="d-flex justify-content-center align-items-center"
      style={style ? { ...style } : { ...globalStyles.iconButton }}
    >
      {icon}
    </Button>
  );
}
