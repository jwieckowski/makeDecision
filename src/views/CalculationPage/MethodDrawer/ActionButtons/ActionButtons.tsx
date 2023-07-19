import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import { Save, Trash3, PlayCircleFill } from "react-bootstrap-icons";
import { useTour } from "@reactour/tour";

// REDUX
import { RootState, useAppDispatch } from "../../../../redux";

// SLICES
import {
  clearBody,
  getResults,
  resetBody,
  resetResults,
  setCalculationMatrixId,
} from "../../../../redux/slices/calculationSlice";
import {
  setBlocks,
  setClickedBlocks,
  setConnections,
  setActiveBlock,
  setBlockStyles,
} from "../../../../redux/slices/blocksSlice";

// HOOKS
import { useLocale } from "../../../../hooks";

// COMPONENTS
import Button from "../../../../components/Button";
import Tooltip from "../../../../components/Tooltip";

// UTILS
import {
  printDocument,
  generateResultsFile,
} from "../../../../utilities/files";
import useCalculation from "../../../../utilities/calculation";
import { getNotConnectedBlocks } from "../../../../utilities/blocks";
import useSnackbars from "../../../../utilities/snackbars";

// STYLES
import globalStyles from "../../../../common/globalStyles";

export default function ActionButtons() {
  const { blocks, connections } = useSelector(
    (state: RootState) => state.blocks
  );
  const { allMethods } = useSelector((state: RootState) => state.dictionary);
  const { results } = useSelector((state: RootState) => state.calculation);

  const { t } = useTranslation();
  const { locale } = useLocale();
  const dispatch = useAppDispatch();
  const { getCalculateBody } = useCalculation();
  const { showSnackbar } = useSnackbars();

  const handleClearClick = () => {
    dispatch(setClickedBlocks([]));
    dispatch(setActiveBlock(null));
    dispatch(setConnections([]));
    dispatch(setBlocks([]));
    dispatch(resetResults());
    dispatch(resetBody());
  };

  const handleCalculateClick = async () => {
    dispatch(clearBody());

    // show added but not connected blocks
    if (getNotConnectedBlocks(blocks, connections).length > 0) {
      getNotConnectedBlocks(blocks, connections).forEach((b) => {
        dispatch(
          setBlockStyles({
            id: b._id,
            data: {
              border: "3px solid red",
            },
          })
        );
      });
      if (blocks.length > 1) {
        showSnackbar(t("snackbar:not-connected-blocks"), "error");
      }
      return;
    }
    setTimeout(async () => {
      const res = getCalculateBody(blocks, connections, allMethods);
      if (res !== undefined && res.calculate) {
        console.log(res);
        await dispatch(setCalculationMatrixId(res.matrixIndexes));
        await dispatch(getResults({ locale, params: res.body }));
      }
    });
  };

  return (
    <Container
      className="d-flex flex-column p-0 m-0 tour-step-three"
      style={{
        ...globalStyles.actionButtonsWrapper,
      }}
    >
      <Container className="" style={{ ...globalStyles.actionButtonsRow }}>
        <Tooltip
          text={t("common:tooltip-graph")}
          placement="top"
          element={
            <Button
              text={t("results:save-graph")}
              icon={<Save />}
              onClick={printDocument}
              style={globalStyles.buttonInfo}
            />
          }
        />
        <Tooltip
          text={
            results !== null
              ? t("common:tooltip-results")
              : t("common:tooltip-results-disabled")
          }
          placement="top"
          element={
            <Button
              text={t("results:results")}
              icon={<Save />}
              onClick={() =>
                results !== null ? generateResultsFile(results) : {}
              }
              style={globalStyles.buttonInfo}
              disabled={results === null}
            />
          }
        />
      </Container>

      <Container style={{ ...globalStyles.actionButtonsRow }}>
        <Tooltip
          text={t("common:tooltip-clear")}
          placement="top"
          element={
            <Button
              text={t("results:clear")}
              icon={<Trash3 />}
              onClick={handleClearClick}
              style={globalStyles.buttonDanger}
            />
          }
        />
        <Tooltip
          text={t("common:tooltip-calculate")}
          placement="top"
          element={
            <Button
              text={t("results:calculate")}
              icon={<PlayCircleFill />}
              onClick={handleCalculateClick}
              style={globalStyles.buttonSuccess}
            />
          }
        />
      </Container>
    </Container>
  );
}
