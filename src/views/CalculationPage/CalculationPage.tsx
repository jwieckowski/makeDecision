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
import globalStyles from "../../common/globalStyles";

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
      className="d-flex flex-column p-0 m-0 tour-step-fourteen"
      style={globalStyles.calculationWrapper}
    >
      {/* BIG SCREEN CONTAINER */}
      <div className="d-none d-md-flex flex-column">
        <Container
          fluid
          className={`d-flex justify-content-center align-items-center m-0 p-0 ${
            results === null ? "mb-5" : "mb-0"
          }`}
          style={globalStyles.calculationAreaWrapper}
          id="dragArea"
        >
          <DragStory />
          <MethodDrawer />
        </Container>
        <Results />
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
          style={globalStyles.smallCalculationWrapper}
          className="d-flex flex-column justify-content-center align-items-center gap-5"
        >
          <div
            style={{
              ...globalStyles.heading,
              ...globalStyles.w70,
              textAlign: "center",
            }}
          >
            {t("results:work-area")}
          </div>
          <div
            style={{
              ...globalStyles.subheading,
              ...globalStyles.w50,
              textAlign: "center",
            }}
          >
            {t("results:work-area-size")}
          </div>
          <div
            style={{
              ...globalStyles.subheading,
              ...globalStyles.w50,
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
