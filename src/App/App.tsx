import React from "react";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
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
      <HashRouter basename={`${APP_NAME_PATH}`}>
        <ScrollToTop />
        <SnackbarProvider maxSnack={4}>
          <Layout>
            <Routes>
              <Route path={`/`} element={<Home />} />
              <Route path={`/calculation`} element={<Calculation />} />
              <Route path={`/methods`} element={<Methods />} />
              <Route path={`/about`} element={<About />} />
              <Route path={`/contact`} element={<Contact />} />
              <Route path="*" element={<Navigate to={`/`} replace={true} />} />
            </Routes>
          </Layout>
        </SnackbarProvider>
      </HashRouter>
    </TourProvider>
  );
}

export default App;
