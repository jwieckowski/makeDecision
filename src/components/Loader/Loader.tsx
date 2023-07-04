import React from "react";
import { useTranslation } from "react-i18next";

import Spinner from "react-bootstrap/Spinner";

export default function Loader() {
  const { t } = useTranslation();
  return (
    <Spinner
      animation="border"
      role="status"
      style={{ width: "100px", height: "100px" }}
    >
      <span className="visually-hidden">{t("common:loading")}.</span>
    </Spinner>
  );
}
