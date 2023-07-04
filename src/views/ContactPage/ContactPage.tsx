import React from "react";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import {
  Github,
  EnvelopeFill,
  Globe,
  BuildingsFill,
  Box,
} from "react-bootstrap-icons";

// CONST
import {
  GITHUB_PROFILE_LABEL,
  GITHUB_PROFILE_LINK,
  EMAIL_LABEL,
  EMAIL_LINK,
  COMET_LABEL,
  COMET_LINK,
  MCDA_IT_LABEL,
  MCDA_IT_LINK,
  PYMCDM_LABEL,
  PYMCDM_LINK,
  PYMCDM_APA,
  PYMCDM_DOI,
  PYFDM_LABEL,
  PYFDM_LINK,
  PYFDM_APA,
  PYFDM_DOI,
  PYIFDM_LABEL,
  PYIFDM_LINK,
  PYIFDM_APA,
  PYIFDM_DOI,
} from "../../common/const";

// STYLES
import globalStyles from "../../common/globalStyles";

export default function ContactPage() {
  const { t } = useTranslation();

  const packages = [
    {
      link: PYMCDM_LINK,
      label: PYMCDM_LABEL,
      apa: PYMCDM_APA,
      doi: PYMCDM_DOI,
    },
    {
      link: PYFDM_LINK,
      label: PYFDM_LABEL,
      apa: PYFDM_APA,
      doi: PYFDM_DOI,
    },
    {
      link: PYIFDM_LINK,
      label: PYIFDM_LABEL,
      apa: PYIFDM_APA,
      doi: PYIFDM_DOI,
    },
  ];

  const websites = [
    {
      label: COMET_LABEL,
      link: COMET_LINK,
    },
    {
      label: MCDA_IT_LABEL,
      link: MCDA_IT_LINK,
    },
  ];

  const contacts = [
    {
      label: GITHUB_PROFILE_LABEL,
      link: GITHUB_PROFILE_LINK,
      icon: <Github style={globalStyles.linkIcon} />,
    },
    {
      label: EMAIL_LABEL,
      link: EMAIL_LINK,
      icon: <EnvelopeFill style={globalStyles.linkIcon} />,
    },
  ];

  return (
    <Container
      fluid
      style={{
        padding: 0,
        margin: 0,
        height: "100%",
      }}
    >
      <Container style={globalStyles.contactWrapper}>
        <Container className="d-flex flex-column gap-3 p-0">
          <div style={{ textAlign: "justify" }}>
            {t("contact:contact-text-1")}
          </div>
          <div style={{ textAlign: "justify" }}>
            {t("contact:contact-text-2")}
          </div>
          <div style={{ textAlign: "justify" }}>
            {t("contact:contact-text-3")}
          </div>
        </Container>
        <Container className="d-flex flex-column gap-3 p-0 mt-5">
          <div style={globalStyles.heading}>{t("common:report-bugs")}</div>
          <div style={{ textAlign: "justify" }}>{t("contact:bugs-text-1")}</div>
        </Container>

        {/* CONTACT */}
        <Stack
          gap={3}
          style={globalStyles.contactLinksWrapper}
          className="d-flex flex-column gap-3"
        >
          <div style={globalStyles.heading}>{t("common:contact-us")}</div>
          {contacts.map((item, idx) => {
            return (
              <div key={idx}>
                <a
                  href={item.link}
                  target="_blank"
                  style={{ textDecoration: "none" }}
                  rel="noreferrer"
                >
                  <div style={globalStyles.linkItem}>
                    {item.icon}
                    <div> {item.label}</div>
                  </div>
                </a>
              </div>
            );
          })}
        </Stack>

        {/* RECOMMENDED SITES */}
        <Stack gap={3} style={globalStyles.contactLinksWrapper}>
          <div style={globalStyles.heading}>
            {t("common:recommended-sites")}
          </div>

          <div style={globalStyles.subheading}>{t("common:packages")}</div>

          {packages.map((item, idx) => {
            return (
              <div key={idx} className="d-flex flex-column gap-2">
                <a
                  href={item.link}
                  target="_blank"
                  style={{ textDecoration: "none" }}
                  rel="noreferrer"
                >
                  <div style={globalStyles.linkItem}>
                    <Box style={globalStyles.linkIcon} />
                    <div> {item.label}</div>
                  </div>
                </a>
                <div>
                  <div style={{ fontSize: "14px" }}>{item.apa}</div>
                  <div>
                    <a
                      href={item.doi}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "12px",
                        textDecoration: "none",
                        color: "grey",
                      }}
                    >
                      {item.doi}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={globalStyles.subheading}>{t("common:websites")}</div>
          {websites.map((item, idx) => {
            return (
              <div key={idx}>
                <a
                  href={item.link}
                  target="_blank"
                  style={{ textDecoration: "none" }}
                  rel="noreferrer"
                >
                  <div style={globalStyles.linkItem}>
                    <Globe style={globalStyles.linkIcon} />
                    <div> {item.label}</div>
                  </div>
                </a>
              </div>
            );
          })}
        </Stack>

        {/* AFFILIATION */}
        <Stack gap={3} style={globalStyles.contactAffiliationWrapper}>
          <div style={globalStyles.heading}>{t("common:affiliation")}</div>
          <div style={{ ...globalStyles.linkItem, cursor: "default" }}>
            <BuildingsFill style={globalStyles.linkIcon} />
            <div>{t("common:research-team-1")}</div>
          </div>
          <div style={{ ...globalStyles.linkItem, cursor: "default" }}>
            <BuildingsFill style={globalStyles.linkIcon} />
            <div>{t("common:research-team-2")}</div>
          </div>
        </Stack>
      </Container>
    </Container>
  );
}
