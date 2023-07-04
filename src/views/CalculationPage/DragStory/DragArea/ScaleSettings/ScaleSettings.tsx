import React from "react";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import { ZoomIn, ZoomOut } from "react-bootstrap-icons";
import { useControls } from "react-zoom-pan-pinch";
import { useXarrow } from "react-xarrows";

// COMPONENTS
import IconButton from "../../../../../components/IconButton";

// STYLES
import globalStyles from "../../../../../common/globalStyles";

export default function ScaleSettings() {
  const { t } = useTranslation();
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const updateXarrow = useXarrow();

  return (
    <Container
      className="d-flex justify-content-end"
      style={{
        ...globalStyles.scaleSettingsWrapper,
        position: "absolute",
        bottom: 4,
        right: 2,
      }}
    >
      <IconButton
        icon={<ZoomIn />}
        onClick={() => {
          zoomIn();
          updateXarrow();
        }}
      />
      <IconButton
        icon={<ZoomOut />}
        onClick={() => {
          zoomOut();
          updateXarrow();
        }}
      />
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          resetTransform();
          updateXarrow();
        }}
      >
        {t("results:reset")}
      </div>
    </Container>
  );
}
