import React from "react";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";

// COMPONENTS
import Image from "../../../components/Image";
// HOOKS
import { useLocale } from "../../../hooks";

// ASSETS
import fc1_EN from "../../../assets/img/MCDA_EN.png";
import fc1_PL from "../../../assets/img/MCDA_PL.png";
import fc2_EN from "../../../assets/img/APP_FLOW_EN.png";
import fc2_PL from "../../../assets/img/APP_FLOW_PL.png";

// STYLES
import globalStyles from "../../../common/globalStyles";

export default function Instruction() {
  const { locale } = useLocale();
  const { t } = useTranslation();

  return (
    <Container
      fluid
      className="w-100 d-flex flex-column align-items-center justify-content-center mt-3 mb-5 gap-3"
    >
      <div style={globalStyles.heading}>{t("about:tab-2").toUpperCase()}</div>

      <Stack
        gap={4}
        className="w-100 d-flex justify-content-center align-items-center"
      >
        <Image
          src={locale === "en" ? fc1_EN : fc1_PL}
          alt={t("home:fig-alt-mcda-flow")}
        />
      </Stack>
    </Container>
  );
}
