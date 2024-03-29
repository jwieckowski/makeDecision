import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

// REDUX
import { RootState, useAppDispatch } from "../../redux";

// SLICES
import { getMethodsDescriptions } from "../../redux/slices/descriptionSlice";

// HOOKS
import { useLocale } from "../../hooks";

// COMPONENTS
import MarkdownText from "../../components/MarkdownText";
import Loader from "../../components/Loader";

// CONST
import { NAV_HEIGHT } from "../../common/const";

// STYLES
import globalStyles, { colors } from "../../common/globalStyles";
import styles from "./MethodsPage.styles";

export default function MethodsPage() {
  const { methods, loading } = useSelector((state: RootState) => ({
    ...state.description,
  }));
  const [groupIndex, setGroupIndex] = useState<number>(0);
  const [methodIndex, setMethodIndex] = useState<number>(0);

  const dataFetchedRef = useRef(false);
  const dispatch = useAppDispatch();
  const { locale } = useLocale();
  const { t } = useTranslation();

  useEffect(() => {
    if (locale === "") return;
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    if (methods.length === 0) dispatch(getMethodsDescriptions(locale));
  }, [locale]);

  useEffect(() => {
    setMethodIndex(0);
  }, [groupIndex]);

  if (loading)
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ height: `calc(100vh - ${NAV_HEIGHT}px)` }}
      >
        <Loader />
      </Container>
    );

  return methods.length > 0 ? (
    <Container
      fluid
      className="d-flex flex-column justify-content-start align-items-center m-0 p-0"
      style={styles.minWidthWrapper}
    >
      {/* GROUP NAV ITEMS */}
      <Nav
        fill
        justify
        variant="tabs"
        activeKey={groupIndex}
        onSelect={(eventKey) => setGroupIndex(eventKey ? +eventKey : 0)}
        style={{ ...globalStyles.mt50, ...globalStyles.tabHeight }}
      >
        {methods.map((method, idx) => {
          return (
            <Nav.Item
              key={`${method.key}-${method.id}`}
              style={globalStyles.h100}
            >
              <Nav.Link
                eventKey={idx}
                className="d-flex justify-content-center align-items-center"
                style={{
                  ...globalStyles.h100,
                  backgroundColor:
                    idx === groupIndex ? colors.darkBackground : "",
                  color: idx === groupIndex ? colors.light : colors.dark,
                }}
              >
                {method.key}
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
      {/* METHODS NAV ITEMS */}
      <Nav
        fill
        justify
        variant="tabs"
        activeKey={methodIndex}
        onSelect={(eventKey) => setMethodIndex(eventKey ? +eventKey : 0)}
        style={globalStyles.tabHeight}
      >
        {methods[groupIndex].data.map((method, idx) => {
          return (
            <Nav.Item key={method.name} style={styles.tabItem}>
              <Nav.Link
                eventKey={idx}
                className="d-flex justify-content-center align-items-center"
                style={{
                  ...globalStyles.h100,
                  backgroundColor:
                    idx === methodIndex ? colors.darkBackground : "",
                  color: idx === methodIndex ? colors.light : colors.dark,
                }}
              >
                {method.name}
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
      {/* METHOD DESCRIPTION */}
      {methods[groupIndex].data[methodIndex]?.description ? (
        <Container
          fluid
          className="d-flex flex-column align-items-center mt-3 mb-5 w-50"
        >
          {methods[groupIndex].data[methodIndex].description.map((text) => {
            return (
              <div
                style={styles.textItemWrapper}
                key={`text-${groupIndex}-${methodIndex}-${text.id}`}
              >
                <div style={styles.textItemBorder}></div>
                <MarkdownText text={text.text} key={`text-${text.id}`} />
              </div>
            );
          })}
          {methods[groupIndex].data[methodIndex].description.length === 0 && (
            <div className="text-center">{t("common:no-description")}</div>
          )}
        </Container>
      ) : null}
    </Container>
  ) : (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center gap-5"
      style={{
        height: `calc(100vh - ${NAV_HEIGHT}px)`,
      }}
    >
      <div style={globalStyles.heading}>
        {t("common:methods-loading-error")}
      </div>
      <div>{t("common:try-again-later")}</div>
    </Container>
  );
}
