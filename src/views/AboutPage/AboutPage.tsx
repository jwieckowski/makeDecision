import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

// COMPONENTS
import { Files, Instruction, MCDA, Technology } from "./AboutContent";

// STYLES
import globalStyles, { colors } from "../../common/globalStyles";

export default function AboutPage() {
  const [groupIndex, setGroupIndex] = useState<number>(0);

  const { t } = useTranslation();
  const location = useLocation();

  const content = [<MCDA />, <Instruction />, <Files />, <Technology />];

  const TABS = [
    t("about:tab-1"),
    t("about:tab-2"),
    t("about:tab-3"),
    t("about:tab-4"),
  ];

  useEffect(() => {
    if (location.state) {
      setGroupIndex(location.state.content);
    }
  }, []);

  return (
    <Container
      fluid
      style={{
        ...globalStyles.p0,
        ...globalStyles.m0,
      }}
      className="d-flex flex-column justify-content-start align-items-center"
    >
      {/* APP DESCRIPTION GROUPS ITEMS */}
      <Nav
        variant="tabs"
        className="d-flex flex-column flex-md-row align-items-center w-100 justify-content-center"
        activeKey={groupIndex}
        onSelect={(eventKey) => setGroupIndex(eventKey ? +eventKey : 0)}
        style={{
          ...globalStyles.mt50,
        }}
      >
        {TABS.map((method, idx) => {
          return (
            <Nav.Item key={idx}>
              <Nav.Link
                eventKey={idx}
                className="d-flex justify-content-center align-items-center"
                style={{
                  ...globalStyles.h100,
                  width: "200px",
                  backgroundColor:
                    idx === groupIndex ? colors.darkBackground : "",
                  color: idx === groupIndex ? colors.light : colors.dark,
                }}
              >
                {method}
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
      <Container
        fluid
        className="d-flex flex-column align-items-center mt-3 mb-5 w-75"
      >
        {content[groupIndex] ? content[groupIndex] : null}
      </Container>
    </Container>
  );
}
