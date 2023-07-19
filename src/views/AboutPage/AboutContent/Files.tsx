import React from "react";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import { Download } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

// COMPONENTS
import Codes from "../../../components/Codes";
import Button from "../../../components/Button";

// CONST
import {
  JSON_CRISP_DATA,
  JSON_FUZZY_DATA,
  CSV_CRISP_DATA,
  CSV_FUZZY_DATA,
  XLSX_CRISP_DATA,
  XLSX_FUZZY_DATA,
  CRISP_CSV_FILE,
  FUZZY_CSV_FILE,
  CRISP_JSON_FILE,
  FUZZY_JSON_FILE,
  CRISP_XLSX_FILE,
  FUZZY_XLSX_FILE,
  APP_URL,
} from "../../../common/const";

// STYLES
import globalStyles from "../../../common/globalStyles";

export default function Files() {
  const { t } = useTranslation();

  const showJSON = (data: any) => {
    return JSON.stringify(
      data,
      function (k, v) {
        if (v instanceof Array) return JSON.stringify(v);
        return v;
      },
      2
    );
  };

  const showCSV = (data: string[]) => {
    return data.join("\n");
  };

  return (
    <Container
      fluid
      className="w-100 d-flex flex-column align-items-center justify-content-center mt-3 mb-5 gap-3"
    >
      <div style={globalStyles.heading}>{t("about:tab-3").toUpperCase()}</div>

      <Stack
        gap={5}
        className="w-100 d-flex justify-content-center align-items-center"
      >
        {/* JSON */}
        {/* CRISP */}
        <Stack gap={3}>
          <div style={globalStyles.subheading} className="w-100">
            {t("about:crisp-json")}
          </div>

          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:crisp-json-description-text-1")}
          </div>
          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:crisp-json-description-text-2")}
          </div>
          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:crisp-json-description-text-3")}
          </div>

          <Codes type="json" data={showJSON(JSON_CRISP_DATA)} />

          <div className="w-100 d-flex flex-column flex-lg-row justify-content-between ">
            <div
              style={{
                ...globalStyles.w100,
                textAlign: "justify",
              }}
            >
              {t("about:file-bad-format")}
            </div>
            <Link
              to={`${APP_URL}/examples/${CRISP_JSON_FILE}`}
              target="_blank"
              download
              className="mx-0 mx-lg-3 my-2 my-lg-0"
              style={globalStyles.noTextDecoration}
            >
              <Button
                text={t("about:download-example-file")}
                icon={<Download />}
                onClick={() => {}}
                style={{
                  ...globalStyles.buttonPrimary,
                  ...globalStyles.w200,
                }}
              />
            </Link>
          </div>
        </Stack>

        {/* FUZZY */}
        <Stack gap={3}>
          <div style={globalStyles.subheading} className="w-100">
            {t("about:fuzzy-json")}
          </div>

          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:fuzzy-json-description-text-1")}
          </div>
          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:fuzzy-json-description-text-2")}
          </div>
          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:fuzzy-json-description-text-3")}
          </div>

          <Codes type="json" data={showJSON(JSON_FUZZY_DATA)} />

          <div className="w-100 d-flex flex-column flex-lg-row justify-content-between ">
            <div
              style={{
                ...globalStyles.w100,
                textAlign: "justify",
              }}
            >
              {t("about:file-bad-format")}
            </div>
            <Link
              to={`${APP_URL}/examples/${FUZZY_JSON_FILE}`}
              target="_blank"
              download
              className="mx-0 mx-lg-3 my-2 my-lg-0"
              style={globalStyles.noTextDecoration}
            >
              <Button
                text={t("about:download-example-file")}
                icon={<Download />}
                onClick={() => {}}
                style={{
                  ...globalStyles.buttonPrimary,
                  ...globalStyles.w200,
                }}
              />
            </Link>
          </div>
        </Stack>

        {/* CSV */}
        {/* CRISP */}
        <Stack gap={3}>
          <div style={globalStyles.subheading} className="w-100">
            {t("about:crisp-csv")}
          </div>

          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:crisp-csv-description-text-1")}
          </div>
          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:crisp-csv-description-text-2")}
          </div>
          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:crisp-csv-description-text-3")}
          </div>

          <Codes type="csv" data={showCSV(CSV_CRISP_DATA)} />

          <div className="w-100 d-flex flex-column flex-lg-row justify-content-between ">
            <div
              style={{
                ...globalStyles.w100,
                textAlign: "justify",
              }}
            >
              {t("about:file-bad-format")}
            </div>
            <Link
              to={`${APP_URL}/examples/${CRISP_CSV_FILE}`}
              target="_blank"
              download
              className="mx-0 mx-lg-3 my-2 my-lg-0"
              style={globalStyles.noTextDecoration}
            >
              <Button
                text={t("about:download-example-file")}
                icon={<Download />}
                onClick={() => {}}
                style={{
                  ...globalStyles.buttonPrimary,
                  ...globalStyles.w200,
                }}
              />
            </Link>
          </div>
        </Stack>

        {/* FUZZY */}
        <Stack gap={3}>
          <div style={globalStyles.subheading} className="w-100">
            {t("about:fuzzy-csv")}
          </div>

          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:fuzzy-csv-description-text-1")}
          </div>
          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:fuzzy-csv-description-text-2")}
          </div>
          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:fuzzy-csv-description-text-3")}
          </div>

          <Codes type="csv" data={showCSV(CSV_FUZZY_DATA)} />

          <div className="w-100 d-flex flex-column flex-lg-row justify-content-between ">
            <div
              style={{
                ...globalStyles.w100,
                textAlign: "justify",
              }}
            >
              {t("about:file-bad-format")}
            </div>
            <Link
              to={`${APP_URL}/examples/${FUZZY_CSV_FILE}`}
              target="_blank"
              download
              className="mx-0 mx-lg-3 my-2 my-lg-0"
              style={globalStyles.noTextDecoration}
            >
              <Button
                text={t("about:download-example-file")}
                icon={<Download />}
                onClick={() => {}}
                style={{
                  ...globalStyles.buttonPrimary,
                  ...globalStyles.w200,
                }}
              />
            </Link>
          </div>
        </Stack>

        {/* XLSX */}
        {/* CRISP */}
        <Stack gap={3}>
          <div style={globalStyles.subheading} className="w-100">
            {t("about:crisp-xlsx")}
          </div>

          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:crisp-xlsx-description-text-1")}
          </div>
          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:crisp-xlsx-description-text-2")}
          </div>
          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:crisp-xlsx-description-text-3")}
          </div>

          <Codes type="xlsx" data={XLSX_CRISP_DATA} />

          <div className="w-100 d-flex flex-column flex-lg-row justify-content-between ">
            <div
              style={{
                ...globalStyles.w100,
                textAlign: "justify",
              }}
            >
              {t("about:file-bad-format")}
            </div>
            <Link
              to={`${APP_URL}/examples/${CRISP_XLSX_FILE}`}
              target="_blank"
              download
              className="mx-0 mx-lg-3 my-2 my-lg-0"
              style={globalStyles.noTextDecoration}
            >
              <Button
                text={t("about:download-example-file")}
                icon={<Download />}
                onClick={() => {}}
                style={{
                  ...globalStyles.buttonPrimary,
                  ...globalStyles.w200,
                }}
              />
            </Link>
          </div>
        </Stack>

        {/* FUZZY */}
        <Stack gap={3}>
          <div style={globalStyles.subheading} className="w-100">
            {t("about:fuzzy-xlsx")}
          </div>

          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:fuzzy-xlsx-description-text-1")}
          </div>
          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:fuzzy-xlsx-description-text-2")}
          </div>
          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:fuzzy-xlsx-description-text-3")}
          </div>

          <Codes type="xlsx" data={XLSX_FUZZY_DATA} />

          <div className="w-100 d-flex flex-column flex-lg-row justify-content-between ">
            <div
              style={{
                ...globalStyles.w100,
                textAlign: "justify",
              }}
            >
              {t("about:file-bad-format")}
            </div>
            <Link
              to={`${APP_URL}/examples/${FUZZY_XLSX_FILE}`}
              target="_blank"
              download
              className="mx-0 mx-lg-3 my-2 my-lg-0"
              style={globalStyles.noTextDecoration}
            >
              <Button
                text={t("about:download-example-file")}
                icon={<Download />}
                onClick={() => {}}
                style={{
                  ...globalStyles.buttonPrimary,
                  ...globalStyles.w200,
                }}
              />
            </Link>
          </div>
        </Stack>
      </Stack>
    </Container>
  );
}
