import React from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";

// STYLES
import globalStyles from "../../common/globalStyles";

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
            <th style={{ fontWeight: "bold" }}>{title ? title : null}</th>
            {Array.from({ length: data[0].length }).map((_, index) => (
              <th key={index} style={{ textAlign: "center" }}>
                {headers[index]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, colIdx) => {
            return (
              <tr>
                <td style={{ fontWeight: "bold" }}>{labels[colIdx]}</td>
                {Array.from({ length: row.length }).map((_, rowIdx) => (
                  <td key={rowIdx} style={{ textAlign: "center" }}>
                    {precision
                      ? parseFloat(`${data[colIdx][rowIdx]}`).toFixed(precision)
                      : data[colIdx][rowIdx]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}
