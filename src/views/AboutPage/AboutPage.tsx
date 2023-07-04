import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

// REDUX
import { RootState, useAppDispatch } from "../../redux";

// HOOKS
import { useLocale } from "../../hooks";

// COMPONENTS
import Image from "../../components/Image";
import { Files, Instruction, MCDA, Technology } from "./AboutContent";

// STYLES
import { colors } from "../../common/globalStyles";

export default function AboutPage() {
  const { about, file, loading, error } = useSelector((state: RootState) => ({
    ...state.about,
  }));
  const [groupIndex, setGroupIndex] = useState<number>(0);

  const { t } = useTranslation();

  const content = [<MCDA />, <Instruction />, <Files />, <Technology />];

  const TABS = [
    t("about:tab-1"),
    t("about:tab-2"),
    t("about:tab-3"),
    t("about:tab-4"),
  ];

  return (
    <Container
      fluid
      style={{
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
      }}
    >
      {/* APP DESCRIPTION GROUPS ITEMS */}
      <Nav
        fill
        justify
        variant="tabs"
        activeKey={groupIndex}
        onSelect={(eventKey) => setGroupIndex(eventKey ? +eventKey : 0)}
        style={{ height: "70px", marginTop: "50px" }}
      >
        {TABS.map((method, idx) => {
          return (
            <Nav.Item
              key={idx}
              style={{
                height: "100%",
                width: "150px",
              }}
            >
              <Nav.Link
                eventKey={idx}
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
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
