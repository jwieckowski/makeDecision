import React, { ReactElement } from "react";
import Container from "react-bootstrap/Container";
import { useTranslation } from "react-i18next";

// COMPONENTS
import CsvCodes from "./CSV";
import JsonCodes from "./JSON";
import XlsxCodes from "./XLSX";

// STYLES
import styles from "./Codes.styles";

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
        ...styles.wrapper,
        flexDirection: "column",
        justifyContent: "start",
      }}
    >
      <div style={styles.codeText}>{t("common:example").toUpperCase()}</div>
      {codes[type]}
    </Container>
  );
}
