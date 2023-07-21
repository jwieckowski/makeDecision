import React, {ReactElement} from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Placement } from "react-bootstrap/esm/types";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

// STYLES
import globalStyles from "../../common/globalStyles";

type TooltipProps = {
  text: string;
  icon?: ReactElement;
  onClick: () => void;
  label: string;
  hide?: number;
  show?: number;
  placement?: Placement;
  style?: any;
};

export default function TooltipButton({
  text,
  icon,
  onClick,
  label,
  hide,
  show,
  placement,
  style,
}: TooltipProps) {
  return (
    <OverlayTrigger
      placement={placement ? placement : "right"}
      delay={{ show: show || 250, hide: hide || 400 }}
      overlay={<Tooltip id="tooltip">{label}</Tooltip>}
    >
      <Button
        size="lg"
        onClick={onClick}
        className={`d-flex justify-content-center align-items-center`}
        style={style ? { ...style } : { ...globalStyles.buttonPrimary }}
      >
        {icon ? icon : null}
        <div
          className="text-uppercase"
          style={
            {
              ...globalStyles.buttonPrimaryText,
              marginLeft: icon ? "5px" : "0",
            }}
        >
          {text}
        </div>
      </Button>
    </OverlayTrigger>
  );
}
