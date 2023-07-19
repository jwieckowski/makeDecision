import React from "react";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import {
  Box,
  Server,
  FileEarmarkTextFill,
  FiletypePy,
  Window,
  FiletypeJsx,
  Diagram3Fill,
  ArrowsMove,
} from "react-bootstrap-icons";

// CONST
import {
  PYMCDM_LABEL,
  PYMCDM_LINK,
  PYMCDM_APA,
  PYMCDM_DOI,
  PYFDM_LABEL,
  PYFDM_LINK,
  PYFDM_APA,
  PYFDM_DOI,
  API_DOCUMENTATION,
  REACT_LINK,
  RTK_LINK,
  DRAGGABLE_LINK,
  XARROWS_LINK,
} from "../../../common/const";

// STYLES
import globalStyles from "../../../common/globalStyles";

export default function Technology() {
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
  ];

  return (
    <Container
      fluid
      className="d-flex flex-column align-items-center mt-3 mb-5 w-100 w-md-75 gap-3"
    >
      <div style={globalStyles.heading}>{t("about:tab-4").toUpperCase()}</div>

      {/* SERVER */}
      <Stack gap={3} style={globalStyles.contactLinksWrapper}>
        <div style={globalStyles.subheading}>{t("about:server")}</div>

        <div style={globalStyles.iconItem}>
          <Server style={globalStyles.linkIcon} />
          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:server-description-text-1")}
          </div>
        </div>

        <div style={globalStyles.iconItem}>
          <FiletypePy style={globalStyles.linkIcon} />
          <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
            {t("about:server-description-text-2")}
          </div>
        </div>

        <a
          href={API_DOCUMENTATION}
          target="_blank"
          style={globalStyles.noTextDecoration}
          rel="noreferrer"
        >
          <div style={globalStyles.linkItem}>
            <FileEarmarkTextFill style={globalStyles.linkIcon} />
            <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
              {t("about:api-docs")}
            </div>
          </div>
        </a>
      </Stack>

      {/* PACKAGES*/}
      <Stack gap={3} style={globalStyles.contactLinksWrapper}>
        <div style={globalStyles.subheading}>{t("common:packages")}</div>

        <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
          {t("about:server-description-text-3")}
        </div>

        {packages.map((item, idx) => {
          return (
            <div key={idx} className="d-flex flex-column gap-2">
              <a
                href={item.link}
                target="_blank"
                style={globalStyles.noTextDecoration}
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
                    style={globalStyles.doiText}
                  >
                    {item.doi}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </Stack>

      {/* APPLICATION */}
      <Stack gap={3} style={globalStyles.contactLinksWrapper}>
        <div style={globalStyles.subheading}>{t("about:application")}</div>

        <a
          href={REACT_LINK}
          target="_blank"
          style={globalStyles.noTextDecoration}
          rel="noreferrer"
        >
          <div style={globalStyles.iconItem}>
            <Window style={globalStyles.linkIcon} />
            <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
              {t("about:app-description-text-1")}
            </div>
          </div>
        </a>

        <a
          href={RTK_LINK}
          target="_blank"
          style={globalStyles.noTextDecoration}
          rel="noreferrer"
        >
          <div style={globalStyles.iconItem}>
            <FiletypeJsx style={globalStyles.linkIcon} />
            <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
              {t("about:app-description-text-2")}
            </div>
          </div>
        </a>

        <a
          href={DRAGGABLE_LINK}
          target="_blank"
          style={globalStyles.noTextDecoration}
          rel="noreferrer"
        >
          <div style={globalStyles.linkItem}>
            <Diagram3Fill style={globalStyles.linkIcon} />
            <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
              {t("about:app-description-text-3")}
            </div>
          </div>
        </a>

        <a
          href={XARROWS_LINK}
          target="_blank"
          style={globalStyles.noTextDecoration}
          rel="noreferrer"
        >
          <div style={globalStyles.linkItem}>
            <ArrowsMove style={globalStyles.linkIcon} />
            <div style={{ ...globalStyles.w100, textAlign: "justify" }}>
              {t("about:app-description-text-4")}
            </div>
          </div>
        </a>
      </Stack>
    </Container>
  );
}
