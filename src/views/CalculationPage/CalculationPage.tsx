import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useTour } from "@reactour/tour";
import Container from "react-bootstrap/Container";

// REDUX
import { RootState } from "../../redux";

// COMPONENTS
import DragStory from "./DragStory";
import Results from "./Results";
import MethodDrawer from "./MethodDrawer";

// CONST
import { NAV_HEIGHT } from "../../common/const";

// STYLES
import globalStyles, { colors } from "../../common/globalStyles";

export default function CalculationPage() {
  const { allMethods, loading } = useSelector(
    (state: RootState) => state.dictionary
  );
  const { results } = useSelector((state: RootState) => state.calculation);

  const { setIsOpen } = useTour();

  const { t } = useTranslation();

  useEffect(() => {
    if (
      window.localStorage.getItem("tour") ||
      loading ||
      allMethods.length === 0
    )
      return;
    setIsOpen(true);
  }, [allMethods]);

  useEffect(() => {
    if (results === null) return;
    const element = document.getElementById("resultsContainer");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [results]);

  return (
    <Container
      fluid
      style={{
        padding: 0,
        margin: 0,
        width: "100%",
        maxWidth: "100vw",
        marginBottom: "200px",
        display: "flex",
        flexDirection: "column",
      }}
      className="tour-step-fourteen"
    >
      {/* BIG SCREEN CONTAINER */}
      <div className="d-none d-md-flex flex-column">
        <Container
          fluid
          style={{
            padding: 0,
            margin: 0,
            width: "100%",
            maxWidth: "100vw",
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
          }}
          id="dragArea"
        >
          <DragStory />
          <MethodDrawer />
        </Container>
        {results !== null ? <Results /> : null}
      </div>
      {/* SMALL SCREEN CONTAINER */}
      <Container
        fluid
        className="d-flex justify-content-center align-items-center d-md-none"
        style={{
          height: `calc(100vh - ${NAV_HEIGHT}px)`,
        }}
      >
        <div
          style={{
            height: "70%",
            width: "70%",
            backgroundColor: colors.light,
            borderRadius: 10,
            boxShadow: "0px 5px 5px 3px rgba(66, 68, 90, 1)",
          }}
          className="d-flex flex-column justify-content-center align-items-center gap-5"
        >
          <div
            style={{
              ...globalStyles.heading,
              width: "70%",
              textAlign: "center",
            }}
          >
            {t("results:work-area")}
          </div>
          <div
            style={{
              ...globalStyles.subheading,
              width: "50%",
              textAlign: "center",
            }}
          >
            {t("results:work-area-size")}
          </div>
          <div
            style={{
              ...globalStyles.subheading,
              width: "50%",
              textAlign: "center",
            }}
          >
            {t("results:bigger-screen")}
          </div>
        </div>
      </Container>
    </Container>
  );
}
