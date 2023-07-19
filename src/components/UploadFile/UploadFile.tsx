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
import styles from "./UploadFile.styles";

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
          element={<FiletypeCsv style={styles.icon} />}
        />
        <Tooltip
          text={t("common:accepted-file-format-json")}
          element={<FiletypeJson style={styles.icon} />}
        />
        <Tooltip
          text={t("common:accepted-file-format-xlsx")}
          element={<FiletypeXlsx style={styles.icon} />}
        />
        <Tooltip
          text={t("common:file-formatting-guide")}
          element={<QuestionCircle style={styles.icon} />}
        />
      </Container>
      <Form.Group
        className="mb-3"
        style={{
          ...styles.uploadForm,
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
            <CloudArrowUpFill style={styles.uploadIcon} />
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
