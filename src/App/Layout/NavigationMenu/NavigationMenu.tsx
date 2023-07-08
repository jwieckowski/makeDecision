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
  APP_NAME_PATH,
  URLS,
  NAV_HEIGHT,
  MENU_ITEM_WIDTH,
} from "../../../common/const";

// STYLES
import globalStyles from "../../../common/globalStyles";

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
      // bg="secondary"
      expand="lg"
      className="w-100"
      style={{ height: `${NAV_HEIGHT}px`, ...globalStyles.navbar }}
    >
      <Container fluid id="navMenu">
        <Navbar.Brand
          href={`/${APP_NAME_PATH}${URLS[0]}`}
          style={{ ...globalStyles.logo }}
        >
          {t("common:app")}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-md`}
          aria-labelledby={`offcanvasNavbarLabel-expand-md`}
          placement="end"
          style={{ ...globalStyles.logo }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              id={`offcanvasNavbarLabel-expand-md`}
              style={{ ...globalStyles.menuItem }}
            >
              {t("common:menu")}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="align-items-center pe-3">
            <Nav className="justify-content-end flex-grow-1">
              {PAGES.map((page, index) => (
                <Link
                  to={`/${APP_NAME_PATH}${URLS[index]}`}
                  key={index}
                  style={{
                    width: `${MENU_ITEM_WIDTH}px`,
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  <div
                    className={`text-uppercase ${
                      index === 3 ? "tour-step-thirteen" : ""
                    }`}
                    style={
                      location.pathname === `/${APP_NAME_PATH}${URLS[index]}`
                        ? {
                            ...globalStyles.menuItemActive,
                          }
                        : { ...globalStyles.menuItem }
                    }
                  >
                    {page}
                  </div>
                </Link>
              ))}
            </Nav>
            <Language />
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
