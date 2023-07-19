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

  return (
    <Container
      fluid
      style={{
        ...globalStyles.p0,
        ...globalStyles.m0,
        ...globalStyles.h100,
      }}
      className="d-flex flex-column w-75 m-auto"
    >
      <Container style={globalStyles.mt50}>
        <div
          className="text-center"
          style={{
            ...globalStyles.heading,
            ...globalStyles.mb25,
          }}
        >
          {t("home:home-heading-1")}
        </div>

        <Stack gap={3} className="d-flex flex-column align-items-center">
          <div style={{ textAlign: "justify" }}>
            {t("home:home-text-mcda-1")}
          </div>

          <div style={{ textAlign: "justify" }}>
            {t("home:home-text-mcda-2")}
            <ul style={{ ...globalStyles.lh30, ...globalStyles.mt25 }}>
              <li>{t("home:home-text-mcda-item-1")}</li>
              <li>{t("home:home-text-mcda-item-2")}</li>
              <li>{t("home:home-text-mcda-item-3")}</li>
              <li>{t("home:home-text-mcda-item-4")}</li>
            </ul>
          </div>

          <div>
            <Image
              src={locale === "en" ? fc1_EN : fc1_PL}
              alt={t("home:fig-alt-mcda-flow")}
              width={600}
              maxWidth={"100%"}
            />
          </div>

          <div style={{ textAlign: "justify", ...globalStyles.mt25 }}>
            {t("home:home-text-mcda-3")}
          </div>

          <div style={{ textAlign: "justify" }}>
            {t("home:home-text-mcda-4")}
          </div>
        </Stack>
      </Container>

      <Container
        style={{
          ...globalStyles.mt50,
          ...globalStyles.mb100,
        }}
      >
        <div
          className="text-center"
          style={{
            ...globalStyles.heading,
            ...globalStyles.mb25,
          }}
        >
          {t("home:home-heading-2")}
        </div>
        <Stack gap={3} className="d-flex flex-column align-items-center">
          <div style={{ textAlign: "justify" }}>
            {t("home:home-text-app-1")}
          </div>

          <Image
            src={locale === "en" ? fc2_EN : fc2_PL}
            alt={t("home:fig-alt-app-flow")}
            width={800}
            maxWidth={"100%"}
          />

          <div style={{ textAlign: "justify" }}>
            {t("home:home-text-app-2")}
          </div>

          <div>
            <Button
              text={t("home:home-button-instruction")}
              onClick={() =>
                navigate(`/${APP_NAME_PATH}/about`, {
                  state: {
                    content: 1,
                  },
                })
              }
              style={{ ...globalStyles.buttonInfo, ...globalStyles.w200 }}
            />
          </div>
          <div style={{ textAlign: "justify" }}>
            {t("home:home-text-app-3")}
          </div>
          <div>
            <Button
              text={t("home:home-button-calculation")}
              onClick={() => navigate(`/${APP_NAME_PATH}/calculation`)}
              style={{ ...globalStyles.buttonInfo, ...globalStyles.w200 }}
            />
          </div>
        </Stack>
      </Container>
    </Container>
  );
}
