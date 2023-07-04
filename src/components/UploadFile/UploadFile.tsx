import React, { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import {
  CloudArrowUpFill,
  FiletypeJson,
  FiletypeCsv,
  FiletypeXlsx,
  QuestionCircle,
} from "react-bootstrap-icons";

// COMPONENTS
import Tooltip from "../Tooltip";

// STYLES
import globalStyles from "../../common/globalStyles";

type UploadFileProps = {
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  style?: any;
  labelStyle?: any;
};

export default function UploadFile({
  onUpload,
  label,
  style,
  labelStyle,
}: UploadFileProps) {
  const { t } = useTranslation();
  return (
    <Container>
      <Container fluid className="d-flex justify-content-end mb-1 gap-1">
        <Tooltip
          text={t("common:accepted-file-format-csv")}
          element={
            <FiletypeCsv style={{ fontSize: "24px", cursor: "pointer" }} />
          }
        />
        <Tooltip
          text={t("common:accepted-file-format-json")}
          element={
            <FiletypeJson style={{ fontSize: "24px", cursor: "pointer" }} />
          }
        />
        <Tooltip
          text={t("common:accepted-file-format-xlsx")}
          element={
            <FiletypeXlsx style={{ fontSize: "24px", cursor: "pointer" }} />
          }
        />
        <Tooltip
          text={t("common:file-formatting-guide")}
          element={
            <QuestionCircle style={{ fontSize: "24px", cursor: "pointer" }} />
          }
        />
      </Container>
      <Form.Group
        className="mb-3"
        style={{
          border: "2px solid #2AABDF",
          backgroundColor: "rgba(42, 171, 223, 0.2)",
          borderRadius: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {label ? (
          <Form.Label
            style={
              labelStyle
                ? { ...labelStyle }
                : { ...globalStyles.uploadFileLabel, flexDirection: "column" }
            }
            htmlFor="upload-file"
          >
            {label}
            <CloudArrowUpFill style={{ fontSize: "60px" }} />
          </Form.Label>
        ) : null}
        <input
          id="upload-file"
          hidden
          accept="text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json"
          type="file"
          onChange={onUpload}
        />
      </Form.Group>
    </Container>
  );
}
