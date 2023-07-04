import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useSnackbar, SnackbarKey } from "notistack";
import { useTranslation } from "react-i18next";

// COMPONENTS
import NavigationMenu from "./NavigationMenu";
import Footer from "./Footer";

// HOOKS
import { useOnlineStatus } from "../../hooks";

// CONST
import { APP_NAME_PATH, NAV_HEIGHT, HIDE_DURATION } from "../../common/const";

// TRANSLATIONS
import "../../translations";

interface LayoutChildren {
  children: React.ReactNode | React.ReactFragment;
}

export default function Layout({ children }: LayoutChildren) {
  const [snackbarKey, setSnackbarKey] = useState<SnackbarKey>(0);

  const isOnline = useOnlineStatus();
  const location = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOnline) {
      const key = enqueueSnackbar(t("common:no-internet"), {
        variant: "info",
        persist: !isOnline,
      });
      setSnackbarKey(key);
    } else if (snackbarKey !== 0) {
      closeSnackbar(snackbarKey);
      setSnackbarKey(0);

      enqueueSnackbar(t("common:back-online"), {
        variant: "success",
        autoHideDuration: HIDE_DURATION,
      });
    }
  }, [isOnline]);

  return (
    <Container
      fluid
      style={{
        display: "flex",
        maxWidth: "100vw",
        minHeight: "100vh",
        height: "100%",
        flexDirection: "column",
        margin: 0,
        padding: 0,
      }}
    >
      <NavigationMenu />
      <Container
        fluid
        style={{
          display: "flex",
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
          minHeight: `calc(100vh - ${NAV_HEIGHT}px)`,
          overflowX: "hidden",
        }}
      >
        {children}
      </Container>
      {location.pathname !== `/${APP_NAME_PATH}/contact` ? <Footer /> : null}
    </Container>
  );
}
