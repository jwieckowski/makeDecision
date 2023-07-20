import React, { useState, useEffect, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import { Trash3 } from "react-bootstrap-icons";

// REDUX
import { RootState, useAppDispatch } from "../../../redux";
import { BlockType } from "../../../redux/types";

// SLICES
import {
  setBlockExtension,
  setBlockWeights,
  setBlockAdditionals,
  setBlockMatrix,
} from "../../../redux/slices/blocksSlice";
import {
  getMatrix,
  resetConvertedMatrix,
} from "../../../redux/slices/calculationSlice";
import {
  setBlockTypes,
  setBlockFileName,
  setBlockAlternatives,
  setBlockCriteria,
  blockFileDelete,
} from "../../../redux/slices/blocksSlice";

// HOOKS
import { useLocale } from "../../../hooks";

// COMPONENTS
import UploadFile from "../../UploadFile";
import Select from "../../Select";
import { default as InputMatrix } from "../../Matrix";
import Input from "../../Input";
import Checkbox from "../../Checkbox";
import IconButton from "../../IconButton";

// UTILS
import useCalculation from "../../../utilities/calculation";
import useValidation from "../../../utilities/validation";
import {
  convertCrispInput,
  convertFuzzyInput,
  convertTextLength,
} from "../../../utilities/formatting";
import useSnackbars from "../../../utilities/snackbars";

// CONST
import {
  MIN_ALTERNATIVES,
  MAX_ALTERNATIVES,
  MIN_CRITERIA,
  MAX_CRITERIA,
} from "../../../common/const";

// STYLES
import styles from "./styles.js";
import globalStyles, { colors } from "../../../common/globalStyles";

type MatrixProps = {
  data: null | BlockType;
};

export default function Matrix({ data }: MatrixProps) {
  const { blocks, connections } = useSelector(
    (state: RootState) => state.blocks
  );
  const { convertedMatrix } = useSelector(
    (state: RootState) => state.calculation
  );

  const [matrix, setMatrix] = useState<string[][]>([]);
  const [criteriaTypes, setCriteriaTypes] = useState<string[]>([]);
  const [showMatrix, setShowMatrix] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { showSnackbar } = useSnackbars();
  const { validateCrispInput, validateFuzzyInput } = useValidation();
  const { getMatrixWeightsConnections, getWeightsMethodConnections } =
    useCalculation();

  // INPUT MATRIX EFFECTS
  useEffect(() => {
    if (data === null) return;

    const { alternatives, criteria } = data.data;

    const weightsBlock = getMatrixWeightsConnections(blocks, connections, data);
    weightsBlock.forEach((b) => {
      dispatch(
        setBlockCriteria({
          id: b._id,
          data: criteria,
        })
      );
    });

    let value = "";
    if (data.data.extension === "crisp") value = "0";
    else if (data.data.extension === "fuzzy") value = "0, 0, 0";

    // FILL BLOCK MATRIX WITH VALUES
    if (alternatives > 0 && criteria > 0) {
      let copy = Array(
        alternatives <= MAX_ALTERNATIVES ? alternatives : MAX_ALTERNATIVES
      )
        .fill(null)
        .map(() =>
          Array(criteria <= MAX_CRITERIA ? criteria : MAX_CRITERIA).fill(value)
        );

      if (data.data.matrix.length > 0) {
        if (
          (data.data.extension === "crisp" &&
            !`${data.data.matrix[0][0]}`.includes(",")) ||
          (data.data.extension === "fuzzy" &&
            `${data.data.matrix[0][0]}`.includes(","))
        )
          copy = copy.map((r, idx) => {
            return r.map((c, idxx) => {
              return idx < data.data.matrix.length &&
                idxx < data.data.matrix[0].length
                ? `${data.data.matrix[idx][idxx]}`
                : c;
            });
          });
      }

      setMatrix([...copy]);
      dispatch(
        setBlockMatrix({
          id: data?._id,
          data: [
            ...copy.map((r) => {
              return r.map((c) => (data.data.extension === "crisp" ? +c : c));
            }),
          ],
        })
      );
    }
  }, [data?.data.alternatives, data?.data.criteria, data?.data.extension]);

  useEffect(() => {
    if (data === null) return;

    if (data.data.matrix.length !== 0) {
      setMatrix([...data.data.matrix]);
    }

    if (data.data.criteria > MAX_CRITERIA) return;

    if (data.data.criteria > 0) {
      let copy = Array(
        data.data.criteria <= MAX_CRITERIA ? data.data.criteria : MAX_CRITERIA
      ).fill("");

      copy = copy.map((r, idx) => {
        return idx < data.data.types.length ? data.data.types[idx] : r;
      });

      setCriteriaTypes([...copy]);
    }
  }, [data]);

  // UPLOAD FILE EFFECTS
  useEffect(() => {
    if (convertedMatrix !== null && Object.keys(convertedMatrix).length !== 0) {
      dispatch(
        setBlockMatrix({
          id: data?._id,
          data: convertedMatrix["matrix"],
        })
      );
      dispatch(
        setBlockTypes({
          id: data?._id,
          data: convertedMatrix["criteriaTypes"],
        })
      );
      dispatch(
        setBlockCriteria({
          id: data?._id,
          data: convertedMatrix["criteriaTypes"]?.length,
        })
      );
      dispatch(
        setBlockAlternatives({
          id: data?._id,
          data: convertedMatrix["matrix"].length,
        })
      );
      dispatch(resetConvertedMatrix());
    }
  }, [convertedMatrix]);

  // CRITERIA TYPES EFFECTS
  useEffect(() => {
    if (data === null) return;
    if (data.data.criteria > MAX_CRITERIA) return;

    dispatch(
      setBlockTypes({
        id: data?._id,
        data: data.data.types.filter((c, idx) => idx < data.data.criteria),
      })
    );
  }, [data?.data.criteria]);

  const handleFileDelete = () => {
    dispatch(
      blockFileDelete({
        id: data?._id,
      })
    );
    dispatch(resetConvertedMatrix());
  };

  const handleExtensionChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setBlockExtension({
        id: data?._id,
        data: event.target.value as string,
      })
    );

    // CLEAR FILE
    if (data?.method === "file") handleFileDelete();

    // UPDATE EXTENSIONS IN WEIGHTS AND METHODS BLOCKS
    if (data !== null) {
      const weightsBlock = getMatrixWeightsConnections(
        blocks,
        connections,
        data
      );
      weightsBlock.forEach((b) => {
        dispatch(
          setBlockWeights({
            id: b._id,
            data: [],
          })
        );
      });

      getWeightsMethodConnections(weightsBlock, blocks, connections).forEach(
        (block) => {
          block.forEach((b) => {
            dispatch(
              setBlockAdditionals({
                id: b._id,
                data: [],
              })
            );
          });
        }
      );
    }
  };

  const handleTypeChange = (
    event: ChangeEvent<HTMLInputElement>,
    col: number | undefined
  ) => {
    if (col === undefined) return;
    let copy = [...criteriaTypes];
    copy[col] = event.target.value as string;
    setCriteriaTypes(copy);
    dispatch(setBlockTypes({ id: data?._id, data: copy }));
  };

  function validateInput(
    value: number,
    min: number,
    max: number,
    cb: Function
  ) {
    dispatch(cb(value >= min ? (value > max ? max : +value) : min));
  }

  function changeAlternatives(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    let value = e.target.value;
    if (isNaN(+value)) return;
    dispatch(
      setBlockAlternatives({
        id: data?._id,
        data: +value,
      })
    );
  }

  function changeCriteria(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    let value = e.target.value;
    if (isNaN(+value)) return;
    dispatch(
      setBlockCriteria({
        id: data?._id,
        data: +value,
      })
    );
  }

  const handleMatrixInputChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    row: number,
    col: number
  ) => {
    e.preventDefault();
    if (data === null) return;

    // VALIDATE INPUT
    if (
      !validateCrispInput(data, e.target.value) ||
      !validateFuzzyInput(data, e.target.value)
    )
      return;

    // COPY MATRIX AND CHANGE SINGLE VALUE
    let copy = [...matrix];
    copy = copy.map((r, idx) => {
      return idx === row
        ? r.map((c, idxx) => {
            return idxx === col
              ? data.data.extension === "crisp"
                ? convertCrispInput(e.target.value)
                : convertFuzzyInput(e.target.value)
              : c;
          })
        : r;
    });

    // CHANGE MATRIX DATA STATE
    setMatrix([...copy]);
    dispatch(
      setBlockMatrix({
        id: data?._id,
        data: copy,
      })
    );
  };

  // MATRIX FILE UPLOAD
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (data?.data.extension) {
        const formData = new FormData();
        formData.append(
          "matrix",
          new Blob([e.target.files[0]], { type: e.target.files[0].type }),
          e.target.files[0].name
        );
        formData.append("extension", data?.data.extension);

        setShowMatrix(false);

        const response = await dispatch(getMatrix({ locale, body: formData }));
        if (response.meta.requestStatus === "fulfilled") {
          showSnackbar(t("snackbar:matrix-upload-success"), "success");
          dispatch(
            setBlockFileName({
              id: data?._id,
              data: e.target.files[0].name,
            })
          );
        }
      }
    }
  };

  const items = [
    {
      label: t("results:crisp"),
      value: "crisp",
    },
    {
      label: t("results:fuzzy"),
      value: "fuzzy",
    },
  ];

  const types = [
    {
      label: t("common:none"),
      value: "",
    },
    {
      label: t("results:profit"),
      value: "1",
    },
    {
      label: t("results:cost"),
      value: "-1",
    },
  ];

  return (
    <Container fluid style={{ ...styles.wrapper, flexDirection: "column" }}>
      <Stack
        direction="horizontal"
        gap={3}
        className="d-flex justify-content-center"
      >
        <Select
          label={t("results:extension") as string}
          style={styles.selectExtension}
          labelStyle={styles.selectExtensionLabel}
          items={items}
          value={data === null ? "crisp" : data.data.extension}
          onChange={handleExtensionChange}
        />
        {data !== null && data.method !== "file" ? (
          <>
            <Input
              type="string"
              value={data.data.alternatives}
              placeholder={t("results:alternatives") as string}
              style={styles.inputMatrixSize}
              label={t("results:alternatives") as string}
              labelStyle={styles.selectExtensionLabel}
              onChange={(e) => changeAlternatives(e)}
              onBlur={() =>
                validateInput(
                  data.data.alternatives,
                  MIN_ALTERNATIVES,
                  MAX_ALTERNATIVES,
                  setBlockAlternatives
                )
              }
            />
            <Input
              type="string"
              value={data.data.criteria}
              placeholder={t("results:criteria") as string}
              style={styles.inputMatrixSize}
              label={t("results:criteria") as string}
              labelStyle={styles.selectExtensionLabel}
              onChange={(e) => changeCriteria(e)}
              onBlur={() =>
                validateInput(
                  data.data.criteria,
                  MIN_CRITERIA,
                  MAX_CRITERIA,
                  setBlockCriteria
                )
              }
            />
          </>
        ) : null}
      </Stack>
      {/* INPUT TYPE */}
      {data !== null && data.method === "input" ? (
        <InputMatrix
          matrix={data.data.matrix}
          alternatives={data.data.alternatives}
          criteria={data.data.criteria}
          extension={data.data.extension}
          onChange={handleMatrixInputChange}
        />
      ) : null}
      {/* FILE TYPE */}
      {data !== null && data.method === "file" ? (
        <>
          <UploadFile
            onUpload={handleFileChange}
            label={t("common:upload-files") as string}
          />
          {data.data.fileName !== null ? (
            <Container>
              <div className="d-flex justify-content-between align-items-center">
                <Checkbox
                  id="showMatrixCheckbox"
                  label={`${t("common:edit-uploaded-matrix")}`}
                  value={showMatrix}
                  onChange={(e) => setShowMatrix(e.target.checked)}
                  style={{ width: "150px" }}
                />
                <div className="d-flex gap-3 align-items-center">
                  <div style={{ textAlign: "end", fontSize: "14px" }}>
                    {t("common:uploaded-file")}{" "}
                    <div style={{ fontWeight: "bold", fontSize: "12px" }}>
                      {convertTextLength(data.data.fileName)}
                    </div>
                  </div>
                  <div>
                    <IconButton
                      icon={<Trash3 />}
                      onClick={handleFileDelete}
                      style={{
                        ...globalStyles.iconButton,
                        backgroundColor: colors.errorBackground,
                        border: `2px solid ${colors.error}`,
                      }}
                    />
                  </div>
                </div>
              </div>
              {showMatrix ? (
                <InputMatrix
                  matrix={data.data.matrix}
                  alternatives={data.data.alternatives}
                  criteria={data.data.criteria}
                  extension={data.data.extension}
                  onChange={handleMatrixInputChange}
                />
              ) : null}
            </Container>
          ) : null}
        </>
      ) : null}
      {/* CRITERIA TYPES */}
      {data !== null ? (
        <Container>
          <div
            style={{ ...globalStyles.criteriaTypesLabel, textAlign: "center" }}
          >
            {t("results:criteria-types")}
          </div>
          <Stack
            direction="horizontal"
            gap={3}
            className="d-flex"
            style={{
              ...globalStyles.criteriaTypesWrapper,
              flexDirection: "row",
              justifyContent: data.data.criteria < 4 ? "center" : "start",
            }}
          >
            {Array(
              data.data.criteria <= MAX_CRITERIA
                ? data.data.criteria
                : MAX_CRITERIA
            )
              .fill(0)
              .map((_, col) => {
                return (
                  <Select
                    label={`C${col + 1}`}
                    style={styles.selectExtension}
                    labelStyle={styles.selectCriteriaLabel}
                    items={types}
                    value={
                      data === null || data.data.types.length === 0
                        ? ""
                        : data.data.types[col]
                    }
                    onChange={(e) => handleTypeChange(e, col)}
                  />
                );
              })}
          </Stack>
        </Container>
      ) : null}
    </Container>
  );
}
