import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import { Github, EnvelopeFill, BuildingsFill } from "react-bootstrap-icons";

// STYLES
import globalStyles, { colors } from "../../../common/globalStyles";

// CONST
import {
  GITHUB_PROFILE_LABEL,
  GITHUB_PROFILE_LINK,
  EMAIL_LABEL,
  EMAIL_LINK,
} from "../../../common/const";

export default function Footer() {
  const [hover, setHover] = useState<boolean[]>([false, false, false, false]);
  const { t } = useTranslation();

  const handleMouseAction = (index: number, value: boolean) => {
    setHover((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  return (
    <Container
      fluid
      style={{ ...globalStyles.footerWrapper, alignItems: "center" }}
    >
      <Container
        style={{
          ...globalStyles.footerSection,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack gap={1}>
          <div style={globalStyles.footerLinkHeader}>
            {t("common:nav-page-5")}
          </div>
          <a
            href={GITHUB_PROFILE_LINK}
            target="_blank"
            style={{ textDecoration: "none" }}
            rel="noreferrer"
          >
            <div
              style={{
                ...globalStyles.footerLinkItem,
                transition: "color 200ms ease-in",
                color: hover[0] ? colors.light : colors.lightMuted,
              }}
              onMouseEnter={() => handleMouseAction(0, true)}
              onMouseLeave={() => handleMouseAction(0, false)}
            >
              <Github style={globalStyles.footerLinkIcon} />
              <div> {GITHUB_PROFILE_LABEL}</div>
            </div>
          </a>
          <a
            href={EMAIL_LINK}
            target="_blank"
            style={{ textDecoration: "none" }}
            rel="noreferrer"
          >
            <div
              style={{
                ...globalStyles.footerLinkItem,
                transition: "color 200ms ease-in",
                color: hover[1] ? colors.light : colors.lightMuted,
              }}
              onMouseEnter={() => handleMouseAction(1, true)}
              onMouseLeave={() => handleMouseAction(1, false)}
            >
              <EnvelopeFill style={globalStyles.footerLinkIcon} />
              <div> {EMAIL_LABEL}</div>
            </div>
          </a>
        </Stack>
      </Container>
      <Container
        style={{
          ...globalStyles.footerSection,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack gap={1}>
          <div style={globalStyles.footerLinkHeader}>
            {t("common:research-team")}
          </div>
          <div
            style={{
              ...globalStyles.footerLinkItem,
              transition: "color 200ms ease-in",
              color: hover[2] ? colors.light : colors.lightMuted,
            }}
            onMouseEnter={() => handleMouseAction(2, true)}
            onMouseLeave={() => handleMouseAction(2, false)}
          >
            <BuildingsFill style={globalStyles.footerLinkIcon} />
            <div>{t("common:research-team-1")}</div>
          </div>
          <div
            style={{
              ...globalStyles.footerLinkItem,
              transition: "color 200ms ease-in",
              color: hover[3] ? colors.light : colors.lightMuted,
            }}
            onMouseEnter={() => handleMouseAction(3, true)}
            onMouseLeave={() => handleMouseAction(3, false)}
          >
            <BuildingsFill style={globalStyles.footerLinkIcon} />
            <div>{t("common:research-team-2")}</div>
          </div>
        </Stack>
        {/* <div>
          If you are using this application in your research, please cite 
        </div> */}
      </Container>
    </Container>
  );
}
