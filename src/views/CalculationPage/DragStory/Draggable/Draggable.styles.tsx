type dict = {
  [key: string]: object;
};

export default function blockStyles(type: string, active: boolean) {
  const method = {
    backgroundColor: "rgba(64, 56, 236, 0.7)",
    border: active ? "3px solid black" : "3px solid rgb(64, 56, 236)",
    height: "90px",
    width: "120px",
  };

  const matrix = {
    backgroundColor: "rgba(223, 236, 56, 0.7)",
    border: active ? "3px solid black" : "3px solid rgba(223, 236, 56)",
    height: "90px",
    width: "120px",
  };

  const weights = {
    backgroundColor: "rgba(236, 176, 56, 0.7)",
    border: active ? "3px solid black" : "3px solid rgba(236, 176, 56)",
    height: "90px",
    width: "120px",
  };

  const ranking = {
    backgroundColor: "rgba(236, 56, 91, 0.7)",
    border: active ? "3px solid black" : "3px solid rgb(236, 56, 91)",
    height: "90px",
    width: "120px",
  };

  const visualization = {
    backgroundColor: "rgba(168, 56, 236, 0.7)",
    border: active ? "3px solid black" : "3px solid rgb(168, 56, 236)",
    height: "90px",
    width: "120px",
  };

  const correlation = {
    backgroundColor: "rgb(94, 236, 56 , 0.7)",
    border: active ? "3px solid black" : "3px solid rgb(94, 236, 56)",
    height: "90px",
    width: "120px",
  };

  const neutral = {
    backgroundColor: "rgba(102, 102, 102, 0.7)",
    border: active ? "3px solid black" : "3px solid rgb(102, 102, 102)",
    height: "90px",
    width: "120px",
  };

  const types: dict = {
    method: method,
    matrix: matrix,
    weights: weights,
    ranking: ranking,
    visualization: visualization,
    correlation: correlation,
  };

  return types[type] || neutral;
}
