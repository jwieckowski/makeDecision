import React from "react";
import { useTranslation } from "react-i18next";

import Spinner from "react-bootstrap/Spinner";

// STYLES
import styles from "./Loader.styles";

export default function Loader() {
  const { t } = useTranslation();
  return (
    <Spinner animation="border" role="status" style={styles.spinner}>
      <span className="visually-hidden">{t("common:loading")}.</span>
    </Spinner>
  );
}
