import React from "react";
import "pikaday/css/pikaday.css";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.min.css";
import { registerAllModules } from "handsontable/registry";

registerAllModules();

type XlsxCodesProps = {
  data: string | any[][];
};

export default function XlsxCodes({ data }: XlsxCodesProps) {
  if (typeof data === "string") return <></>;
  return (
    <HotTable
      data={data}
      rowHeaders={true}
      colHeaders={true}
      height="auto"
      licenseKey="non-commercial-and-evaluation"
      readOnly={true}
    />
  );
}
