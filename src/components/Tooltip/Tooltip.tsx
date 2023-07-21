import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Placement } from "react-bootstrap/esm/types";

type TooltipProps = {
  text: string;
  element: React.ReactElement;
  hide?: number;
  show?: number;
  placement?: Placement;
  style?: any;
};

export default function MyTooltip({
  text,
  element,
  hide,
  show,
  placement,
  style,
}: TooltipProps) {
  return (
    <OverlayTrigger
      placement={placement ? placement : "right"}
      delay={{ show: show || 250, hide: hide || 400 }}
      overlay={<Tooltip id="tooltip">{text}</Tooltip>}
    >
      {element}
    </OverlayTrigger>
  );
}
