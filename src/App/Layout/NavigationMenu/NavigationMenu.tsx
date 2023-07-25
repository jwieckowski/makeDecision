import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";

// COMPONENTS
import Language from "./Language";

// CONST
import {
  APPLICATION_NAME,
  APP_NAME_PATH,
  URLS,
  NAV_HEIGHT,
  MENU_ITEM_WIDTH,
} from "../../../common/const";

// STYLES
import globalStyles from "../../../common/globalStyles";
import styles from "./NavigationMenu.styles";

export default function NavigationMenu() {
  const { t } = useTranslation();
  const location = useLocation();

  const PAGES = [
    t("common:nav-page-1"),
    t("common:nav-page-2"),
    t("common:nav-page-3"),
    t("common:nav-page-4"),
    t("common:nav-page-5"),
  ];
  return (
    <Navbar
      key="lg"
      expand="lg"
      className="w-100"
      style={{ height: `${NAV_HEIGHT}px`, ...styles.navbar }}
    >
      <Container fluid id="navMenu">
        <Navbar.Brand href={`${URLS[0]}`} style={{ ...styles.logo }}>
          {APPLICATION_NAME}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={`side-navbar`} />
        <Navbar.Offcanvas
          id={`side-navbar`}
          aria-labelledby={`side-navbar-label`}
          placement="end"
          style={{ ...styles.sideNavbar }}
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title
              id={`side-navbar-label`}
              style={{ ...styles.menuItem, ...styles.menu }}
            >
              {t("common:menu")}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="align-items-center pe-3">
            <Nav className="justify-content-end flex-grow-1">
              {PAGES.map((page, index) => (
                <Link
                  to={`${URLS[index]}`}
                  key={index}
                  className="text-lg-center"
                  style={{
                    width: `${MENU_ITEM_WIDTH}px`,
                    ...globalStyles.noTextDecoration,
                  }}
                >
                  <div
                    className={`text-uppercase ${
                      index === 3 ? "tour-step-thirteen" : ""
                    }`}
                    style={
                      location.pathname === `${URLS[index]}`
                        ? {
                            ...styles.menuItemActive,
                          }
                        : { ...styles.menuItem }
                    }
                  >
                    {page}
                  </div>
                </Link>
              ))}
            </Nav>
            <div className="pt-sm-3 pt-lg-0">
              <Language />
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
