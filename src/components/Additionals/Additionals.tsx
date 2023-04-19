import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { RootState, useAppDispatch } from "../../redux";
import { BlockType, AdditionalType } from "../../redux/types";
import { Box, Typography, Button } from "@mui/material";

import {
  getMethodData,
  getAdditionalParameters,
} from "../../utilities/filtering";
import {
  setModalOpen,
  setBlockAdditionals,
} from "../../redux/slices/blocksSlice";

import { SelectChangeEvent } from "@mui/material/Select";
import Extension from "./Extension";
import Metrics from "./Metrics";
import InputMatrix from "./InputMatrix";
import CriteriaTypes from "./CriteriaTypes";
import UploadFile from "./UploadFile";
import CriteriaAlternatives from "./CriteriaAlternatives";
import InputWeights from "./InputWeights";

import { useTranslation } from "react-i18next";

// TODO preference_function for PROMETHEE
export default function Additionals() {
  const [block, setBlock] = useState<BlockType | null>(null);
  const [metricsValues, setMetricsValues] = useState<AdditionalType[] | []>([]);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { allMethods, loading, error } = useSelector((state: RootState) => ({
    ...state.dictionary,
  }));

  console.log(metricsValues);

  const { activeBlock, connections, blocks } = useSelector(
    (state: RootState) => ({ ...state.blocks })
  );
  const { methodParameters } = useSelector((state: RootState) => ({
    ...state.calculation,
  }));

  useEffect(() => {
    setBlock(blocks.filter((b) => b._id === activeBlock?.id)[0]);
  }, [blocks]);

  useEffect(() => {
    if (block === null) return;
    if (block.data.additionals.length === 0) return;

    let metrics: [] | any = [];
    getMethodsConnectedBlocksExtensions().forEach((b, index) => {
      let tempMetric: [] | any = [];
      getAdditionalParameters(
        activeBlock?.additional,
        b.extension
      )[0].data.forEach((item) => {
        console.log(item);
        let value = getAdditionalValueFromBlock(
          block?.data.additionals[index],
          item.parameter
        );
        console.log(value);
        tempMetric = [
          ...tempMetric,
          {
            [item.parameter]: value,
          },
        ];
      });
      metrics = [...metrics, tempMetric];
    });

    setMetricsValues(metrics);
  }, [block]);

  const onMetricValueChange = (
    event: SelectChangeEvent,
    parameter: string,
    index: number
  ) => {
    console.log(parameter, event.target.value);
    if (metricsValues.length === 0) {
      setMetricsValues([
        {
          [parameter]: event.target.value as string,
        },
      ]);
    } else {
      if (metricsValues.length < index + 1) {
        setMetricsValues([
          ...metricsValues,
          {
            [parameter]: event.target.value as string,
          },
        ]);
      } else {
        setMetricsValues(
          metricsValues.map((metric, idx) => {
            return idx !== index
              ? metric
              : {
                  ...metric,
                  [parameter]: event.target.value as string,
                };
          })
        );
      }
    }
  };

  const checkBlockType = (type: string) => {
    return activeBlock?.type.toLowerCase() === type;
  };
  const checkBlockName = (type: string) => {
    return activeBlock?.name.toLowerCase() === type;
  };

  const getBlockInputConnections = () => {
    return connections.filter((c) => +c[1] === activeBlock?.id);
  };

  const getAdditionalValueFromBlock = (
    additionals: {} | AdditionalType,
    parameter: string
  ) => {
    if (Object.keys(additionals).length === 0) return "";
    return additionals[parameter as keyof typeof additionals];
  };

  const getWeightsConnectedBlocksExtensions = () => {
    const matrices = blocks.filter((b) => b.type.toLowerCase() === "matrix");

    let connectedMatrix = connections
      .filter((c) => activeBlock?.id === +c[1])
      .map((c) => c[0]);
    let indexes: [] | number[] = [];
    connectedMatrix.forEach((cm) => {
      matrices.forEach((m, idx) => {
        if (+cm === m._id) indexes = [...indexes, idx];
      });
    });

    return blocks
      .filter((b) => connectedMatrix.includes(b._id.toString()))
      .map((b) => {
        return {
          id: b._id,
          extension: b.data.extension,
        };
      });
  };

  const getMethodsConnectedBlocksExtensions = () => {
    const matrices = blocks.filter((b) => b.type.toLowerCase() === "matrix");

    let indexes: [] | number[] = [];
    matrices.forEach((m, idx) => {
      let weightsID: [] | string[] = [];
      // save weights id
      connections.forEach((c) => {
        if (c[0] === m._id.toString()) {
          weightsID = [...weightsID, c[1]];
        }
      });

      // check weights to method connection
      weightsID.forEach((w) => {
        connections.forEach((c) => {
          if (c[0] === w && c[1] === activeBlock?.id.toString()) {
            indexes = indexes.includes(idx as never)
              ? indexes
              : [...indexes, idx];
          }
        });
      });
    });

    return matrices
      .map((m) => m.data.extension)
      .map((e, idx) => {
        return { extension: e, index: idx };
      })
      .filter((e) => indexes.includes(e.index as never));
  };

  function addParameters() {
    if (!block?.data.extension) return;
    if (!metricsValues) return;

    dispatch(
      setBlockAdditionals({
        id: activeBlock?.id,
        data: metricsValues,
      })
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        margin: "auto",
        border: "1px solid black",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Box>
        <Typography textAlign="center" variant="h6">
          {block?.label.toUpperCase()}
        </Typography>
        <Typography textAlign="center" variant="body1">
          {block?.typeLabel.toUpperCase()}
        </Typography>
      </Box>
      {/* MATRIX TYPE */}
      {checkBlockType("matrix") && <Extension />}
      {checkBlockType("matrix") &&
        (checkBlockName("input") || checkBlockName("random")) && (
          <CriteriaAlternatives />
        )}
      {checkBlockType("matrix") && checkBlockName("input") && <InputMatrix />}
      {checkBlockType("matrix") &&
        (checkBlockName("input") || checkBlockName("random")) && (
          <CriteriaTypes />
        )}
      {checkBlockType("matrix") &&
        (checkBlockName("input") || checkBlockName("random")) && (
          <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <Button onClick={() => dispatch(setModalOpen(false))}>
              <Typography color="black">
                {t("common:save").toUpperCase()}
              </Typography>
            </Button>
          </Box>
        )}
      {checkBlockType("matrix") && checkBlockName("file") && <UploadFile />}

      {/* WEIGHTS TYPE */}
      {checkBlockType("weights") &&
        checkBlockName("input") &&
        getWeightsConnectedBlocksExtensions().map((extension) => {
          return (
            <Box>
              <Typography>
                {t("common:matrix").toUpperCase()}: {extension.id}
              </Typography>
              <Typography>
                {t("common:extension").toUpperCase()}: {extension.extension}
              </Typography>
              <InputWeights extension={extension.extension} />
            </Box>
          );
        })}
      {checkBlockType("weights") && checkBlockName("input") && (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
          <Button onClick={() => dispatch(setModalOpen(false))}>
            <Typography color="black">{t("common:save")}</Typography>
          </Button>
        </Box>
      )}

      {/* METHOD TYPE */}
      {checkBlockType("method") &&
        getMethodsConnectedBlocksExtensions().map((b, index) => {
          return (
            <Box key={`additional-box-${index}`}>
              <Typography>Matrix: {b.index}</Typography>
              <Typography>Extension: {b.extension}</Typography>

              {getAdditionalParameters(
                activeBlock?.additional,
                b.extension
              )[0]?.data.map((item) => {
                return (
                  <Metrics
                    value={
                      block?.data.additionals[index]
                        ? getAdditionalValueFromBlock(
                            block?.data.additionals[index],
                            item.parameter
                          )
                        : ""
                    }
                    extension={b.extension}
                    method={item.method}
                    parameter={item.parameter}
                    index={index}
                    onChange={onMetricValueChange}
                  />
                );
              })}
            </Box>
          );
        })}
      {checkBlockType("method") && (
        <Typography onClick={addParameters} textAlign="center" sx={{ mt: 2 }}>
          {t("results:add-parameters")}
        </Typography>
      )}
    </Box>
  );
}
