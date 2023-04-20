import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  IconButton,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Xarrow, { Xwrapper } from "react-xarrows";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../redux";
import {
  setBlocks,
  addClickedBlock,
  deleteClickedBlock,
  setClickedBlocks,
  deleteConnection,
  setConnections,
  setActiveBlock,
  setClickedBlockId,
  setModalOpen,
  setModalType,
  setConnectionToDelete,
} from "../../../redux/slices/blocksSlice";
import {
  getResults,
  clearBody,
  resetBody,
  resetResults,
} from "../../../redux/slices/calculationSlice";

import { CalculationBodyType } from "../../../redux/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

import DraggableBox from "../DraggableBox";
import { getNotConnectedBlocks } from "../../../utilities/blocks";
import {
  getMatrixWeightsConnections,
  getWeightsMethodConnections,
  getMethodsParams,
  createWeightMethodPair,
  getMethodCorrelationConnections,
  getMethodRankingConnections,
  getRankingCorrelationConnections,
} from "../../../utilities/calculation";
import useBlocksConnection from "../../../utilities/connections";

import { HIDE_DURATION, ZOOM_STEP, COLORS, PATHS } from "../../../common/const";

import { useTranslation } from "react-i18next";

export default function DragStory() {
  const { allMethods } = useSelector((state: RootState) => state.dictionary);
  const { blocks, clickedBlocks, connections, draggedItem, activeBlock } =
    useSelector((state: RootState) => state.blocks);
  const { error } = useSelector((state: RootState) => state.calculation);
  const { addBlockConnection, checkForWrongExtensionMethodConnection } =
    useBlocksConnection();

  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const gridRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    addBlockConnection();
    checkForWrongExtensionMethodConnection(connections);
  }, [blocks, clickedBlocks]);

  useEffect(() => {
    const currentBlocks = blocks.map((b) => b._id);

    clickedBlocks.map((b) => {
      if (!currentBlocks.includes(+b)) {
        dispatch(deleteClickedBlock(b));
      }
    });
    connections.forEach((c) => {
      let blockId = null;
      if (!currentBlocks.includes(+c[0])) blockId = c[0];
      else if (!currentBlocks.includes(+c[1])) blockId = c[1];

      if (blockId !== null) {
        dispatch(deleteConnection(c));
      }
    });

    if (!currentBlocks.includes(activeBlock?.id as never)) {
      dispatch(setActiveBlock(null));
    }
  }, [blocks]);

  // xarrows settings
  const [size, setSize] = useState<number>(4);
  const [headSize, setHeadSize] = useState<number>(8);
  const [color, setColor] = useState<string>(COLORS[0]);
  const [curveness, setCurveness] = useState<number>(0.8);
  const [path, setPath] = useState<any>(PATHS[0]);

  // grid area settings
  const [zoom, setZoom] = useState<number>(1);
  const [gridOn, setGridOn] = useState<boolean>(false);
  const [gridSize, setGridSize] = useState<number>(50);

  function handleSizeChange(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    e.preventDefault();
    setSize(+e.target.value);
  }

  function handleHeadSizeChange(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    e.preventDefault();
    setHeadSize(+e.target.value);
  }

  function handleCurvenessChange(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    e.preventDefault();
    setCurveness(+e.target.value);
  }

  const handleColorChange = (e: SelectChangeEvent) => {
    setColor(e.target.value);
  };

  const handlePathChange = (e: SelectChangeEvent) => {
    setPath(e.target.value);
  };

  const handleZoomClick = (value: number) => {
    setZoom((prev) => prev + value);
  };

  const handleGridChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGridOn(e.target.checked);
  };

  function handleGridSizeChange(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    e.preventDefault();
    setGridSize(+e.target.value);
  }

  const printDocument = () => {
    const input = document.getElementById("blockArea");
    if (input === null) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        format: "a3",
        unit: "px",
      });
      pdf.addImage(imgData, "PNG", 0, 0, 600, 0, undefined, undefined);
      pdf.save("graph.pdf");
    });
  };

  useEffect(() => {
    if (error === null) return;
    enqueueSnackbar(error, {
      variant: "error",
      autoHideDuration: HIDE_DURATION,
    });
  }, [error]);

  const handleClick = (
    e: React.MouseEvent<HTMLElement>,
    id: string,
    type: string,
    method: string
  ) => {
    e.stopPropagation();
    if (draggedItem !== null) return;
    if (clickedBlocks.includes(id as never)) return;
    dispatch(addClickedBlock(id));
    dispatch(setClickedBlockId(+id));

    allMethods.forEach((methods) => {
      if (methods.key.toLowerCase().includes(type.toLowerCase())) {
        dispatch(
          setActiveBlock({
            ...methods.data.filter(
              (item) => item.name.toLowerCase() === method.toLowerCase()
            )[0],
            id: +id,
          })
        );
      }
    });
  };

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

    let calculate = true;
    let body: CalculationBodyType = {
      matrixFiles: [],
      matrix: [],
      extensions: [],
      types: [],
      method: [],
      methodCorrelations: [],
      methodRankings: [],
      rankingCorrelations: [],
      params: [],
    };

    // console.log(getNotConnectedBlocks(blocks, connections))

    let matrixIndexes: [] | number[] = [];

    // first step to check connections from matrix to weights
    const matrices = blocks.filter((block) => block.type.includes("matrix"));
    if (matrices.length === 0) {
      enqueueSnackbar("No input data given", {
        variant: "error",
        autoHideDuration: HIDE_DURATION,
      });
      calculate = false;
      return;
    }

    // for each matrix in structure do calculations
    matrices.forEach((matrix, matrixIdx) => {
      // console.log(matrix.data.matrix);

      calculate = true;
      const weightsItems = getMatrixWeightsConnections(
        blocks,
        connections,
        matrix
      );

      if (weightsItems.length === 0) {
        matrixIndexes = [...matrixIndexes, matrixIdx];
        enqueueSnackbar(`Matrix not connected to any weights`, {
          variant: "error",
          autoHideDuration: HIDE_DURATION,
        });
        calculate = false;
        return;
      }

      // validate matrix
      if (
        matrix.method === "file" &&
        Array.isArray(matrix.data.matrixFile) &&
        matrix.data.matrixFile.length === 0
      ) {
        enqueueSnackbar(`Uploaded matrix file is empty`, {
          variant: "error",
          autoHideDuration: HIDE_DURATION,
        });
        calculate = false;
        return;
      }

      if (matrix.method === "input") {
        //  no matrix defined
        if (matrix.data.matrix.length === 0) {
          enqueueSnackbar(`Input matrix was not defined`, {
            variant: "error",
            autoHideDuration: HIDE_DURATION,
          });
          calculate = false;
          return;
        }

        // CRISP
        if (matrix.data.extension === "crisp") {
          // zero values in input matrix
          if (
            matrix.data.matrix
              .map((r: number[]) => r.some((item) => item === 0) === true)
              .some((r: boolean) => r === true) === true
          ) {
            enqueueSnackbar(`Zero values in input matrix`, {
              variant: "warning",
              autoHideDuration: HIDE_DURATION,
            });
            calculate = false;
          }

          // same values in column
          for (let i = 0; i < matrix.data.matrix[0].length; i++) {
            const colValue = [...matrix.data.matrix.map((r: number[]) => r[i])];
            const unique = Array.from(new Set(colValue));
            if (unique.length === 1) {
              enqueueSnackbar(`Same values in column ${i + 1}`, {
                variant: "error",
                autoHideDuration: HIDE_DURATION,
              });
              calculate = false;
              return;
            }
          }
          // FUZZY
        } else if (matrix.data.extension === "fuzzy") {
          // zero values in input matrix
          if (
            matrix.data.matrix
              .map(
                (r: string[]) => r.some((item) => item === "0, 0, 0") === true
              )
              .some((r: boolean) => r === true) === true
          ) {
            enqueueSnackbar(`Zero values in fuzzy input matrix`, {
              variant: "warning",
              autoHideDuration: HIDE_DURATION,
            });
            calculate = false;
            return;
          }
          // not three numbers given
          if (
            matrix.data.matrix
              .map(
                (r: string[]) =>
                  r.some(
                    (item) =>
                      item.split(",").length !== 3 ||
                      item.split(",").some((item: string) => item.trim() === "")
                  ) === true
              )
              .some((r: boolean) => r === true) === true
          ) {
            enqueueSnackbar(
              `Not all elements in fuzzy matrix has 3 values separated by comma`,
              {
                variant: "warning",
                autoHideDuration: HIDE_DURATION,
              }
            );
            calculate = false;
            return;
          }
          // not ascending order of fuzzy numbers
          if (
            matrix.data.matrix
              .map(
                (r: string[]) =>
                  r.some((item) => {
                    const numbers = item.split(",").map((n) => +n);
                    return !numbers.every(
                      (v: number, i: number) => i === 0 || v >= numbers[i - 1]
                    );
                  }) === true
              )
              .some((r: boolean) => r === true) === true
          ) {
            enqueueSnackbar(
              `Elements in the fuzzy matrix should in ascending order or equal`,
              {
                variant: "warning",
                autoHideDuration: HIDE_DURATION,
              }
            );
            calculate = false;
            return;
          }
        }
      }

      // validate types
      if (["input", "random"].includes(matrix.method)) {
        //  no types given
        if (matrix.data.types.length === 0) {
          enqueueSnackbar(`Criteria types were not given`, {
            variant: "error",
            autoHideDuration: HIDE_DURATION,
          });
          calculate = false;
          return;
        }

        let size =
          matrix.method === "random"
            ? matrix.data.randomMatrix[1]
            : matrix.data.matrix[0].length;
        if (size !== matrix.data.types.length) {
          enqueueSnackbar(`Not all criteria types were given`, {
            variant: "error",
            autoHideDuration: HIDE_DURATION,
          });
          calculate = false;
          return;
        }
      }

      body.extensions = [...body.extensions, matrix.data.extension];
      if (matrix.method === "input")
        body.matrix = [...body.matrix, matrix.data.matrix];
      else if (matrix.method === "random")
        body.matrix = [...body.matrix, matrix.data.randomMatrix];
      else if (matrix.method === "file")
        body.matrix = [...body.matrix, matrix.data.matrixFile];

      if (["input", "random"].includes(matrix.method))
        body.types = [...body.types, matrix.data.types.map((t) => +t)];
      else body.types = [...body.types, []];

      // check mcda connections with weights
      const mcdaItems = getWeightsMethodConnections(
        weightsItems,
        blocks,
        connections
      );
      if (mcdaItems.length === 0) {
        enqueueSnackbar(`No MCDA method was used`, {
          variant: "error",
          autoHideDuration: HIDE_DURATION,
        });
        calculate = false;
        return;
      }

      //  validate weights
      weightsItems.forEach((weights) => {
        if (weights.method === "input" && weights.data.weights.length === 0) {
          enqueueSnackbar(`No weights given in weights block`, {
            variant: "error",
            autoHideDuration: HIDE_DURATION,
          });
          calculate = false;
          return;
        }

        //  CRISP
        if (weights.method === "input" && matrix.data.extension === "crisp") {
          const sum = weights.data.weights
            .map((w) => +w)
            .reduce((total, value) => Number(total) + Number(value), 0);
          // check if weights are greater than 0
          if (weights.data.weights.some((w) => +w === 0)) {
            enqueueSnackbar(`None of weights should equal 0`, {
              variant: "error",
              autoHideDuration: HIDE_DURATION,
            });
            calculate = false;
            return;
            // check if any weight is less than 0
          } else if (weights.data.weights.some((w) => +w < 0)) {
            enqueueSnackbar(`None of weights should equal less than 0`, {
              variant: "error",
              autoHideDuration: HIDE_DURATION,
            });
            calculate = false;
            return;
            // check if sum of weights equals 1
          } else if (Math.round(sum * 100) / 100 !== 1) {
            enqueueSnackbar(`Weights should sum up to 1`, {
              variant: "error",
              autoHideDuration: HIDE_DURATION,
            });
            calculate = false;
            return;
          }
          //  FUZZY
        } else if (
          weights.method === "input" &&
          matrix.data.extension === "fuzzy"
        ) {
          // zero values in input matrix
          if (
            weights.data.weights.some((item: string) => item === "0, 0, 0") ===
            true
          ) {
            enqueueSnackbar(`Zero values in fuzzy input weights`, {
              variant: "warning",
              autoHideDuration: HIDE_DURATION,
            });
            calculate = false;
            return;
          }
          // not three numbers given
          if (
            weights.data.weights.some(
              (item) =>
                item.split(",").length !== 3 ||
                item.split(",").some((item: string) => item.trim() === "")
            ) === true
          ) {
            enqueueSnackbar(
              `Not all elements in fuzzy weights has 3 values separated by comma`,
              {
                variant: "warning",
                autoHideDuration: HIDE_DURATION,
              }
            );
            calculate = false;
            return;
          }
          // not ascending order of fuzzy numbers
          if (
            weights.data.weights.some((item) => {
              const numbers = item.split(",").map((n) => +n);
              return !numbers.every(
                (v: number, i: number) => i === 0 || v >= numbers[i - 1]
              );
            }) === true
          ) {
            enqueueSnackbar(
              `Elements in the fuzzy weights should in ascending order or equal`,
              {
                variant: "warning",
                autoHideDuration: HIDE_DURATION,
              }
            );
            calculate = false;
            return;
          }
        }
      });

      // append params for the methods
      const params = getMethodsParams(
        mcdaItems,
        matrixIdx,
        matrix.data.extension
      );
      body.params = [...body.params, [...params]];

      const methodItem = createWeightMethodPair(weightsItems, mcdaItems);
      if (methodItem.length > 0) {
        body.method = [...body.method, [...methodItem]];
      }

      // correlations connections -> (method -> correlation)
      const methodCorrelationItem = getMethodCorrelationConnections(
        blocks,
        connections,
        weightsItems,
        mcdaItems
      );
      if (methodCorrelationItem.length > 0) {
        body.methodCorrelations = [
          ...body.methodCorrelations,
          [...methodCorrelationItem],
        ];
      }

      // ranking connections -> (method -> ranking)
      const methodRankingItem = getMethodRankingConnections(
        blocks,
        connections,
        weightsItems,
        mcdaItems,
        allMethods
      );
      if (methodRankingItem.length > 0) {
        body.methodRankings = [...body.methodRankings, [...methodRankingItem]];
      }
      // correlations connections -> (ranking -> correlation)
      const rankingCorrelationItem = getRankingCorrelationConnections(
        blocks,
        connections,
        weightsItems,
        mcdaItems,
        allMethods
      );
      if (rankingCorrelationItem.length > 0) {
        body.rankingCorrelations = [
          ...body.rankingCorrelations,
          [...rankingCorrelationItem],
        ];
      }
    });

    calculate && (await dispatch(getResults(body)));
  };

  const handleGridClick = () => {
    dispatch(setClickedBlockId(null));
    dispatch(setClickedBlocks([]));
    dispatch(setActiveBlock(null));
  };

  const handleArrowClick = (c: string[]) => {
    dispatch(setModalType("connection"));
    dispatch(setModalOpen(true));
    dispatch(setConnectionToDelete(c));
  };

  return (
    <Grid sx={{ width: "100%", height: "80vh" }}>
      {/* BIG SCREEN */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "90%",
            margin: "1% 5%",
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Button variant="contained" onClick={printDocument}>
            <SaveAltIcon />
            {t("results:save-graph")}
          </Button>
          <Button
            sx={{ margin: "0 1%" }}
            variant="contained"
            onClick={handleClearClick}
          >
            <HighlightOffIcon />
            {t("results:clear")}
          </Button>
          <Button variant="contained" onClick={handleCalculateClick}>
            <PlayCircleOutlineIcon />
            {t("results:calculate")}
          </Button>
        </Box>
        <Grid
          container
          position="relative"
          direction="column"
          justifyContent="start"
          alignItems="center"
          flexDirection="row"
          style={{
            width: "90%",
            margin: "1% 5%",
            height: "100%",
            border: "3px solid black",
            cursor: "pointer",
            zoom: zoom,
            background: gridOn
              ? `conic-gradient(from 90deg at 1px 1px,#0000 90deg,grey 0) 0 0/${gridSize}px ${gridSize}px`
              : "",
          }}
          onClick={handleGridClick}
          id="blockArea"
          ref={gridRef}
        >
          <Xwrapper>
            {blocks.map((block) => {
              return (
                <DraggableBox
                  key={block._id}
                  id={block._id.toString()}
                  type={block.type}
                  typeLabel={block.typeLabel}
                  method={block.method}
                  label={block.label}
                  handleClick={handleClick}
                  zoom={zoom}
                />
              );
            })}
            {connections.map((c, cIdx) => {
              return (
                <Xarrow
                  key={cIdx}
                  start={c[0]}
                  end={c[1]}
                  strokeWidth={size}
                  headSize={headSize}
                  path={path}
                  curveness={curveness}
                  color={color}
                  passProps={{
                    cursor: "pointer",
                    onClick: () => handleArrowClick(c),
                  }}
                />
              );
            })}
          </Xwrapper>
        </Grid>
        <Box
          sx={{
            width: "90%",
            margin: "0 5%",
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          {gridOn && (
            <TextField
              style={{ width: "80px", marginRight: 5 }}
              key="size-grid"
              value={gridSize}
              label={`${t("results:size")}`}
              type="number"
              onChange={(e) => handleGridSizeChange(e)}
              InputProps={{
                inputProps: {
                  min: 10,
                  max: 100,
                  step: 1,
                },
              }}
            />
          )}
          <Box sx={{ mr: 1 }}>
            <FormControlLabel
              control={<Checkbox value={gridOn} onChange={handleGridChange} />}
              label={`${t("results:grid")}`}
              labelPlacement="start"
            />
          </Box>
          <Typography variant="body2">{Math.round(zoom * 100)}%</Typography>
          <IconButton onClick={() => handleZoomClick(-ZOOM_STEP)}>
            <ZoomOutIcon />
          </IconButton>
          <IconButton onClick={() => handleZoomClick(ZOOM_STEP)}>
            <ZoomInIcon />
          </IconButton>
        </Box>
        <Box sx={{ width: "90%", margin: "1% 5%" }}>
          <Box>
            <Typography variant="body2">
              {t("results:arrow-settings")}
            </Typography>
          </Box>
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <TextField
              style={{ width: "80px" }}
              key="size-arrow"
              value={size}
              label={`${t("results:size")}`}
              type="number"
              onChange={(e) => handleSizeChange(e)}
              InputProps={{
                inputProps: {
                  min: 1,
                  max: 12,
                },
              }}
            />
            <TextField
              style={{ width: "80px" }}
              key="headSize-arrow"
              value={headSize}
              label={`${t("results:head-size")}`}
              type="number"
              onChange={(e) => handleHeadSizeChange(e)}
              InputProps={{
                inputProps: {
                  min: 1,
                  max: 12,
                },
              }}
            />
            <TextField
              style={{ width: "80px" }}
              key="curveness-arrow"
              value={curveness}
              label={`${t("results:curveness")}`}
              type="number"
              onChange={(e) => handleCurvenessChange(e)}
              InputProps={{
                inputProps: {
                  min: 0.1,
                  max: 2,
                  step: 0.1,
                },
              }}
            />
            <FormControl sx={{ width: "120px" }}>
              <InputLabel id="color-input">{t("results:color")}</InputLabel>
              <Select
                labelId="color-input"
                id="color"
                value={color}
                label={`${t("results:color")}`}
                onChange={handleColorChange}
              >
                {COLORS.map((color, idx) => {
                  return (
                    <MenuItem value={color} key={idx}>
                      <Typography variant="body2">{color}</Typography>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl sx={{ width: "120px" }}>
              <InputLabel id="path-input">{t("results:path")}</InputLabel>
              <Select
                labelId="path-input"
                id="path"
                value={path}
                label={`${t("results:path")}`}
                onChange={handlePathChange}
              >
                {PATHS.map((path, idx) => {
                  return (
                    <MenuItem value={path} key={idx}>
                      <Typography variant="body2">{path}</Typography>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* SMALL SCREEN */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: { xs: "flex", md: "none" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography textAlign="center" variant="h5" sx={{ p: 5 }}>
            {t("results:work-area")}
          </Typography>
          <Typography textAlign="center" variant="h5" sx={{ p: 5 }}>
            {t("results:bigger-screen")}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
}
