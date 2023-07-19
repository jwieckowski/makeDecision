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

// STYLES
import globalStyles from "../../common/globalStyles";

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
      className="d-flex flex-column p-0 m-0"
      style={globalStyles.layoutWrapper}
    >
      <NavigationMenu />
      <Container
        fluid
        className="d-flex m-0 p-0"
        style={{
          ...globalStyles.contentWrapper,
          overflowX: "hidden",
          minHeight: `calc(100vh - ${NAV_HEIGHT}px)`,
        }}
      >
        {children}
      </Container>
      {location.pathname !== `/${APP_NAME_PATH}/contact` ? <Footer /> : null}
    </Container>
  );
}
