import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";

// COMPONENTS
import Image from "../../components/Image";
import Button from "../../components/Button";

// HOOKS
import { useLocale } from "../../hooks";

// ASSETS
import fc1_EN from "../../assets/img/MCDA_EN.png";
import fc1_PL from "../../assets/img/MCDA_PL.png";
import fc2_EN from "../../assets/img/APP_FLOW_EN.png";
import fc2_PL from "../../assets/img/APP_FLOW_PL.png";

// CONST
import { APP_NAME_PATH } from "../../common/const";

// STYLES
import globalStyles from "../../common/globalStyles";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { locale } = useLocale();

  {
    /* <Container
    fluid
    className="d-flex justify-content-center align-items-center"
    style={{ height: `calc(100vh - ${NAV_HEIGHT}px)` }}
    >
    <Loader />
  </Container> */
  }

  return (
    <Container
      fluid
      style={{
        padding: 0,
        margin: 0,
        height: "100%",
      }}
      className="d-flex flex-column w-75 m-auto"
    >
      <Container
        style={{
          marginTop: "50px",
        }}
      >
        <div
          style={{
            ...globalStyles.heading,
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          {t("home:home-heading-1")}
        </div>
        <Stack
          gap={3}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "justify" }}>
            {t("home:home-text-mcda-1")}
          </div>
          <div style={{ textAlign: "justify" }}>
            {t("home:home-text-mcda-2")}
            <ul>
              <li>{t("home:home-text-mcda-item-1")}</li>
              <li>{t("home:home-text-mcda-item-2")}</li>
              <li>{t("home:home-text-mcda-item-3")}</li>
              <li>{t("home:home-text-mcda-item-4")}</li>
            </ul>
          </div>

          <Image
            src={locale === "en" ? fc1_EN : fc1_PL}
            alt={t("home:fig-alt-mcda-flow")}
          />

          <div style={{ textAlign: "justify", marginTop: 20 }}>
            {t("home:home-text-mcda-3")}
          </div>

          <div style={{ textAlign: "justify" }}>
            {t("home:home-text-mcda-4")}
          </div>
        </Stack>
      </Container>

      <Container
        style={{
          marginTop: "50px",
          marginBottom: "100px",
        }}
      >
        <div
          style={{
            ...globalStyles.heading,
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          {t("home:home-heading-2")}
        </div>
        <Stack
          gap={3}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "justify" }}>
            {t("home:home-text-app-1")}
          </div>
          <Image
            src={locale === "en" ? fc2_EN : fc2_PL}
            alt={t("home:fig-alt-app-flow")}
            width={1000}
          />
          <div style={{ textAlign: "justify" }}>
            {t("home:home-text-app-2")}
          </div>
          <div>
            <Button
              text={t("home:home-button-instruction")}
              onClick={() => navigate(`/${APP_NAME_PATH}/about`)}
              style={{ ...globalStyles.buttonInfo, width: "200px" }}
            />
          </div>
          <div style={{ textAlign: "justify" }}>
            {t("home:home-text-app-3")}
          </div>
          <div>
            <Button
              text={t("home:home-button-calculation")}
              onClick={() => navigate(`/${APP_NAME_PATH}/calculation`)}
              style={{ ...globalStyles.buttonInfo, width: "200px" }}
            />
          </div>
        </Stack>
      </Container>
    </Container>
  );
}
