import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";

// REDUX
import { RootState, useAppDispatch } from "../../../../redux";

// SLICES
import {
  setSize,
  setHeadSize,
  setCurveness,
  setColor,
  setPath,
  setGrid,
  setGridSize,
} from "../../../../redux/slices/settingsSlice";

// COMPONENTS
import Input from "../../../../components/Input";
import Select from "../../../../components/Select";
import ColorPicker from "../../../../components/ColorPicker";
import Checkbox from "../../../../components/Checkbox";

// CONST
import { PATHS } from "../../../../common/const";

// STYLES
import globalStyles from "../../../../common/globalStyles";

export default function DragSettings() {
  const { size, headSize, curveness, path, color, gridOn, gridSize } =
    useSelector((state: RootState) => state.settings);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <Container
      className="d-flex flex-column gap-1 tour-step-four"
      style={{ ...globalStyles.settingsWrapper }}
    >
      <Container className="d-flex gap-1 p-0 m-0">
        <Input
          type={"number"}
          value={headSize}
          label={`${t("results:head-size")}`}
          onChange={(e) => {
            dispatch(setHeadSize(+e.target.value));
          }}
          style={globalStyles.textInput}
        />
        <Input
          type={"number"}
          value={size}
          label={`${t("results:size")}`}
          onChange={(e) => {
            dispatch(setSize(+e.target.value));
          }}
          style={globalStyles.textInput}
        />
        <Input
          type={"number"}
          value={curveness}
          label={`${t("results:curveness")}`}
          onChange={(e) => {
            dispatch(setCurveness(+e.target.value));
          }}
          style={globalStyles.textInput}
        />
        <Select
          items={PATHS}
          value={path}
          onChange={(e) => {
            dispatch(setPath(e.target.value));
          }}
          label={`${t("results:path")}`}
          style={globalStyles.settingsSelect}
        />
        <ColorPicker
          value={color}
          onChange={(e) => {
            dispatch(setColor(e.target.value));
          }}
          label={`${t("results:color")}`}
          style={globalStyles.settingsColorPicker}
        />
      </Container>
      <Container className="d-flex gap-1 p-0 m-0 align-items-center">
        <Checkbox
          id="settingsCheckbox"
          label={`${t("results:grid")}`}
          value={gridOn}
          onChange={(e) => {
            dispatch(setGrid(e.target.checked));
          }}
        />
        <Input
          type={"number"}
          value={gridSize}
          onChange={(e) => {
            dispatch(setGridSize(e.target.value));
          }}
          disabled={!gridOn}
          style={globalStyles.textInput}
        />
      </Container>
    </Container>
  );
}
