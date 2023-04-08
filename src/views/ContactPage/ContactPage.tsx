import React from "react";
import { useTranslation } from "react-i18next";

export default function ContactPage() {
  const { t } = useTranslation();

  return <div>{t("contact:contact")}</div>;
}
