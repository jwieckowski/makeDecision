import React from "react";

import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";

// COMPONENTS
import ActionButtons from "./ActionButtons";
import DragSettings from "./DragSettings";
import SearchBar from "./SearchBar";
import MethodsList from "./MethodsList";

// CONST
import { DRAWER_MIN_WIDTH, NAV_HEIGHT } from "../../../common/const";

// STYLES
import globalStyles from "../../../common/globalStyles";

export default function MethodDrawer() {
  return (
    <Container
      style={{
        width: `${DRAWER_MIN_WIDTH}px`,
        height: `calc(100vh - ${NAV_HEIGHT}px)`,
        ...globalStyles.methodsDrawer,
      }}
    >
      <Stack gap={3} style={{ padding: "15px 15px" }}>
        <ActionButtons />
        <DragSettings />
        <SearchBar />
        <MethodsList />
      </Stack>
    </Container>
  );
}
