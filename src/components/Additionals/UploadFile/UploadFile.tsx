import { useState, useEffect, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloudUpload from "@mui/icons-material/CloudUpload";
import { HIDE_DURATION } from "../../../common/const";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../redux";
import { useSnackbar } from "notistack";
import {
  addMatrixFile,
  setCriteria,
  getMatrix,
} from "../../../redux/slices/calculationSlice";
import {
  setBlockMatrixFile,
  setBlockFileName,
  setBlockMatrix,
  setBlockTypes,
} from "../../../redux/slices/blocksSlice";
import { BlockType } from "../../../redux/types";

import { useTranslation } from "react-i18next";

import InputMatrix from "../InputMatrix";

export default function UploadFile() {
  const { activeBlock, blocks } = useSelector(
    (state: RootState) => state.blocks
  );
  const { convertedMatrix } = useSelector(
    (state: RootState) => state.calculation
  );
  const [name, setName] = useState<string>("");
  const [block, setBlock] = useState<BlockType | null>(null);
  const [checked, setChecked] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    setBlock(blocks.filter((b) => b._id === activeBlock?.id)[0]);
  }, [blocks]);

  useEffect(() => {
    if (
      convertedMatrix.length !== 0 &&
      Object.keys(convertedMatrix).length !== 0
    ) {
      dispatch(
        setBlockMatrix({
          id: activeBlock?.id,
          data: convertedMatrix["matrix"],
        })
      );
      dispatch(
        setBlockFileName({
          id: activeBlock?.id,
          data: name,
        })
      );
      dispatch(
        setBlockTypes({
          id: activeBlock?.id,
          data: convertedMatrix["criteriaTypes"],
        })
      );
      dispatch(setCriteria(convertedMatrix["criteriaTypes"]?.length));
    }
  }, [convertedMatrix]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (block?.data.extension) {
        const formData = new FormData();
        formData.append(
          "matrix",
          new Blob([e.target.files[0]], { type: e.target.files[0].type }),
          e.target.files[0].name
        );
        formData.append("extension", block?.data.extension);
        await dispatch(getMatrix(formData));
      }

      const name = e.target.files[0].name;
      // TODO save file name in block
      setName(name);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Box sx={{ border: "1px solid grey", borderRadius: 5 }}>
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            p: 5,
          }}
        >
          <input
            hidden
            accept="text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json"
            type="file"
            onChange={handleFileChange}
          />
          <CloudUpload fontSize="large" />
          <Typography>{t("common:upload-files")}</Typography>
        </IconButton>
      </Box>
      {block !== null && block.data.fileName !== null && (
        <Box sx={{ maxWidth: "300px", overflow: "auto" }}>
          <Typography sx={{ mt: 2 }} variant="body1">
            {t("common:uploaded-file")}: {block.data.fileName}
          </Typography>
        </Box>
      )}
      {block !== null && block.data.matrix.length !== 0 && (
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={checked} onChange={handleCheckboxChange} />
            }
            label={t("results:show-matrix")}
          />
        </FormGroup>
      )}
      {checked && <InputMatrix />}
    </Box>
  );
}
