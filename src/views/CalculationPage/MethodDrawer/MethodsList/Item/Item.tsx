import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";

// REDUX
import { AllMethodsItem } from "../../../../../redux/types";

// COMPONENTS
import Tooltip from "../../../../../components/Tooltip";

// STYLES
import globalStyles from "../../../../../common/globalStyles";

type ItemProps = {
  index: number;
  methods: AllMethodsItem;
  onClick: Function;
};

export default function Item({ index, methods, onClick }: ItemProps) {
  return (
    <ListGroup.Item key={index}>
      <div style={{ ...globalStyles.textBold }}>{methods.label}</div>
      <ListGroup variant="flush">
        {methods.data.map((method, idx) => {
          return (
            <ListGroup.Item
              key={`inner-item-${idx}`}
              style={{
                cursor: "pointer",
              }}
              onClick={(e) => {
                onClick(
                  e,
                  methods.key,
                  methods.label,
                  method.name,
                  method.label,
                  methods.inputConnections,
                  methods.outputConnections
                );
              }}
            >
              {method.hints === "" ? (
                <Container
                  fluid
                  className="p-0 m-0 d-flex justify-content-between"
                >
                  <div>{method.label}</div>
                  {index === 1 || index === 2 ? (
                    <div
                      className="d-flex gap-1"
                      style={{
                        fontSize: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      {method.extensions
                        .map((item) => item.toUpperCase())
                        .join(", ")}
                    </div>
                  ) : null}
                </Container>
              ) : (
                <Tooltip
                  text={method.hints}
                  placement="top"
                  element={
                    <Container
                      fluid
                      className={`p-0 m-0 d-flex justify-content-between ${
                        index === 0 && idx === 0 ? "tour-step-six" : ""
                      } ${index === 1 && idx === 0 ? "tour-step-eight" : ""}`}
                    >
                      <div>{method.label}</div>
                      {index === 1 || index === 2 ? (
                        <div
                          className="d-flex gap-1"
                          style={{
                            fontSize: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          {method.extensions
                            .map((item) => item.toUpperCase())
                            .join(", ")}
                        </div>
                      ) : null}
                    </Container>
                  }
                />
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </ListGroup.Item>
  );
}
