import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";

// COMPONENTS
import Image from "../../../components/Image";
import Button from "../../../components/Button";

// HOOKS
import { useLocale } from "../../../hooks";

// ASSETS
import fc1_EN from "../../../assets/img/APP_BLOCKS_EN.png";
import fc1_PL from "../../../assets/img/APP_BLOCKS_PL.png";
import structure1_PL from "../../../assets/img/STRUCTURE_1_PL.png";
import structure1_EN from "../../../assets/img/STRUCTURE_1_EN.png";
import structure2_PL from "../../../assets/img/STRUCTURE_2_PL.png";
import structure2_EN from "../../../assets/img/STRUCTURE_2_EN.png";
import structure3_PL from "../../../assets/img/STRUCTURE_3_PL.png";
import structure3_EN from "../../../assets/img/STRUCTURE_3_EN.png";
import structure4_PL from "../../../assets/img/STRUCTURE_4_PL.png";
import structure4_EN from "../../../assets/img/STRUCTURE_4_EN.png";

// CONST
import { APP_NAME_PATH } from "../../../common/const";

// STYLES
import globalStyles from "../../../common/globalStyles";

export default function Instruction() {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="w-100 d-flex flex-column align-items-center justify-content-center mt-3 mb-5 gap-3"
    >
      <div style={globalStyles.heading}>{t("about:tab-2").toUpperCase()}</div>

      <Stack
        gap={5}
        className="w-100 d-flex justify-content-center align-items-center"
      >
        {/* APPLICATION BLOCKS */}
        <Stack
          gap={3}
          className="w-100 d-flex justify-content-center align-items-center pb-5"
        >
          <div style={{ width: "100%", textAlign: "justify" }}>
            {t("about:instructions-text-1")}
          </div>

          <div style={{ ...globalStyles.subheading, width: "100%" }}>
            {t("about:connections-structure").toUpperCase()}
          </div>

          <div style={{ width: "100%", textAlign: "justify" }}>
            {t("about:connections-structure-text-1")}
          </div>

          <div style={{ width: "100%", textAlign: "justify" }}>
            {t("about:connections-structure-text-2")}
          </div>

          <div style={{ width: "100%", textAlign: "justify" }}>
            {t("about:connections-structure-text-3")}
          </div>

          <Image
            src={locale === "en" ? fc1_EN : fc1_PL}
            alt={t("home:fig-alt-app-flow")}
            height={500}
          />
        </Stack>

        {/* BASIC STRUCTURE */}
        <Stack
          gap={3}
          className="w-100 d-flex justify-content-center align-items-center pb-5"
        >
          <div style={{ ...globalStyles.subheading, width: "100%" }}>
            {t("about:basic-structure").toUpperCase()}
          </div>

          <div style={{ width: "100%", textAlign: "justify" }}>
            {t("about:basic-structure-text-1")}
          </div>

          <div style={{ width: "100%", textAlign: "justify" }}>
            {t("about:basic-structure-text-2")}
          </div>

          <Image
            src={locale === "en" ? structure1_EN : structure1_PL}
            alt={t("home:fig-alt-app-flow")}
            height={500}
          />
        </Stack>

        {/* MULTIPLE METHODS STRUCTURE */}
        <Stack
          gap={3}
          className="w-100 d-flex justify-content-center align-items-center pb-5"
        >
          <div style={{ ...globalStyles.subheading, width: "100%" }}>
            {t("about:multiple-mcda-structure").toUpperCase()}
          </div>

          <div style={{ width: "100%", textAlign: "justify" }}>
            {t("about:multiple-mcda-structure-text-1")}
          </div>

          <Image
            src={locale === "en" ? structure2_EN : structure2_PL}
            alt={t("home:fig-alt-app-flow")}
            height={500}
          />
        </Stack>

        {/* MULTIPLE WEIGHTS STRUCTURE */}
        <Stack
          gap={3}
          className="w-100 d-flex justify-content-center align-items-center pb-5"
        >
          <div style={{ ...globalStyles.subheading, width: "100%" }}>
            {t("about:multiple-weights-structure").toUpperCase()}
          </div>

          <div style={{ width: "100%", textAlign: "justify" }}>
            {t("about:multiple-weights-structure-text-1")}
          </div>

          <Image
            src={locale === "en" ? structure3_EN : structure3_PL}
            alt={t("home:fig-alt-app-flow")}
            height={500}
          />
        </Stack>

        {/* COMPLEX STRUCTURE */}
        <Stack
          gap={3}
          className="w-100 d-flex justify-content-center align-items-center pb-5"
        >
          <div style={{ ...globalStyles.subheading, width: "100%" }}>
            {t("about:complex-structure").toUpperCase()}
          </div>

          <div style={{ width: "100%", textAlign: "justify" }}>
            {t("about:complex-structure-text-1")}
          </div>

          <div style={{ width: "100%", textAlign: "justify" }}>
            {t("about:complex-structure-text-2")}
          </div>

          <Image
            src={locale === "en" ? structure4_EN : structure4_PL}
            alt={t("home:fig-alt-app-flow")}
            height={500}
          />

          <div style={{ width: "100%", textAlign: "justify" }}>
            {t("about:complex-structure-text-3")}
          </div>

          <div style={{ width: "100%", textAlign: "justify" }}>
            {t("about:complex-structure-text-4")}
          </div>
        </Stack>

        <div style={{ width: "100%", textAlign: "justify" }}>
          {t("about:application-tutorial")}
        </div>

        <Button
          text={t("home:home-button-calculation")}
          onClick={() => navigate(`/${APP_NAME_PATH}/calculation`)}
          style={{ ...globalStyles.buttonInfo, width: "200px" }}
        />
      </Stack>
    </Container>
  );
}
