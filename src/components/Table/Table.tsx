import React from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";

// STYLES
import globalStyles from "../../common/globalStyles";
import styles from "./Table.styles";

type TableProps = {
  data: (number | string)[][];
  headers: string[];
  labels: string[];
  title?: string;
  precision?: number;
  style?: any;
};

export default function MyTable({
  data,
  headers,
  labels,
  title,
  precision,
  style,
}: TableProps) {
  return (
    <Container
      fluid
      className="py-3 px-0"
      style={globalStyles.resultsTableCardWrapper}
    >
      <Table responsive style={style ? style : null} striped hover>
        <thead>
          <tr>
            <th style={styles.title}>{title ? title : null}</th>
            {Array.from({ length: data[0]?.length ? data[0].length : 0 }).map(
              (_, index) => (
                <th
                  key={index}
                  style={{ ...styles.header, textAlign: "center" }}
                >
                  {headers[index].split(" | ").map((item, idx) => {
                    return (
                      <div
                        style={{
                          fontSize: idx === 0 ? 14 : 10,
                        }}
                      >
                        {item}
                      </div>
                    );
                  })}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, colIdx) => {
            return (
              <tr>
                <td style={styles.label}>
                  {labels[colIdx].split(" | ").map((item, idx) => {
                    return (
                      <div style={{ fontSize: idx === 0 ? 14 : 10 }}>
                        {item}
                      </div>
                    );
                  })}
                </td>
                {Array.from({ length: row?.length ? row.length : 0 }).map(
                  (_, rowIdx) => (
                    <td
                      key={rowIdx}
                      style={{
                        textAlign: "center",
                        ...styles.item,
                      }}
                    >
                      {precision
                        ? parseFloat(`${data[colIdx][rowIdx]}`).toFixed(
                            precision
                          )
                        : data[colIdx][rowIdx]}
                    </td>
                  )
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}
