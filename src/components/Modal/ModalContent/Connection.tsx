import React from "react";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";

// STYLES
import styles from "./styles";

export default function Connection() {
  const { t } = useTranslation();
  return (
    <Container fluid style={{ ...styles.wrapper }}>
      {t("common:connection-delete-confirm")}
    </Container>
  );
}
