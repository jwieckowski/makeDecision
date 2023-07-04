import React, { ReactElement } from "react";
import Container from "react-bootstrap/Container";
import { useTranslation } from "react-i18next";

// COMPONENTS
import CsvCodes from "./CSV";
import JsonCodes from "./JSON";
import XlsxCodes from "./XLSX";

// STYLES
import { colors } from "../../common/globalStyles";

type CodesProps = {
  type: string;
  data: string | any[][];
};

type CodesDict = {
  [key: string]: ReactElement;
};

export default function Codes({ type, data }: CodesProps) {
  const { t } = useTranslation();

  const codes: CodesDict = {
    csv: <CsvCodes data={data} />,
    json: <JsonCodes data={data} />,
    xlsx: <XlsxCodes data={data} />,
  };

  return (
    <Container
      style={{
        backgroundColor: colors.infoBackground,
        border: "3px solid black",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
      }}
    >
      <div style={{ marginBottom: "20px", fontWeight: "bold" }}>
        {t("common:example").toUpperCase()}
      </div>
      {codes[type]}
    </Container>
  );
}
