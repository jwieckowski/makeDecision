import React from "react";

import Container from "react-bootstrap/Container";

// COMPONENTS
import DragArea from "./DragArea";

export default function DragStory() {
  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center m-3 p-0"
    >
      <DragArea />
    </Container>
  );
}
