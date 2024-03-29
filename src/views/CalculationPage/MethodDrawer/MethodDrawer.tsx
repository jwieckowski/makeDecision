import React from "react";
import { useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";

// REDUX
import { RootState } from "../../../redux";

// COMPONENTS
import ActionButtons from "./ActionButtons";
import DragSettings from "./DragSettings";
import SearchBar from "./SearchBar";
import MethodsList from "./MethodsList";
import Loader from "../../../components/Loader";

// CONST
import {
  DRAWER_MIN_WIDTH,
  NAV_HEIGHT,
  METHODS_LIST_HEIGHT,
} from "../../../common/const";

// STYLES
import globalStyles from "../../../common/globalStyles";
import styles from "./MethodDrawer.styles";

export default function MethodDrawer() {
  const { allMethods, loading } = useSelector(
    (state: RootState) => state.dictionary
  );
  return (
    <Container
      style={{
        width: `${DRAWER_MIN_WIDTH}px`,
        height: `calc(100vh - ${NAV_HEIGHT}px)`,
        ...globalStyles.methodsDrawer,
      }}
      className="tour-step-two"
    >
      <Stack gap={3} style={styles.wrapper}>
        <ActionButtons />
        <DragSettings />
        <SearchBar />
        {loading && allMethods.length === 0 ? (
          <div
            style={{
              ...styles.loaderWrapper,
              height: `${METHODS_LIST_HEIGHT}px`,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader />
          </div>
        ) : (
          <MethodsList />
        )}
      </Stack>
    </Container>
  );
}
