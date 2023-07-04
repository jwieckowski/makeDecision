import { ResultsType } from "../redux/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generateResultsFile = (results: [] | ResultsType) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(results, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "results.json";

  link.click();
};

export const printDocument = () => {
  const input = document.getElementById("blockArea");

  if (input === null) return;

  html2canvas(input, {
    scrollX: 0,
    scrollY: 0,
    allowTaint: true,
    useCORS: true,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "l",
      unit: "pt",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("graph.pdf");
  });
};
