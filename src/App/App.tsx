import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { TourProvider } from "@reactour/tour";
import useTourSteps from "../tourSteps";

// VIEWS
import Home from "../views/HomePage";
import Calculation from "../views/CalculationPage";
import Methods from "../views/MethodsPage";
import About from "../views/AboutPage";
import Contact from "../views/ContactPage";

// LAYOUT
import Layout from "./Layout";

// UTILS
import ScrollToTop from "../utilities/scroll";

// CONST
import { APP_NAME_PATH } from "../common/const";

function App() {
  const { tourSteps } = useTourSteps();

  return (
    <TourProvider
      steps={tourSteps}
      disableDotsNavigation={true}
      beforeClose={() => window.localStorage.setItem("tour", "done")}
    >
      <BrowserRouter>
        <ScrollToTop />
        <SnackbarProvider maxSnack={4}>
          <Layout>
            <Routes>
              <Route path={`/${APP_NAME_PATH}`} element={<Home />} />
              <Route
                path={`/${APP_NAME_PATH}/calculation`}
                element={<Calculation />}
              />
              <Route path={`/${APP_NAME_PATH}/methods`} element={<Methods />} />
              <Route path={`/${APP_NAME_PATH}/about`} element={<About />} />
              <Route path={`/${APP_NAME_PATH}/contact`} element={<Contact />} />
              <Route
                path="*"
                element={<Navigate to={`/${APP_NAME_PATH}`} replace={true} />}
              />
            </Routes>
          </Layout>
        </SnackbarProvider>
      </BrowserRouter>
    </TourProvider>
  );
}

export default App;
