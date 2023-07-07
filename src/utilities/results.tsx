// TYPES
import {
  ResultsMethod,
  ResultsMethodRankings,
  ResultsMethodCorrelations,
} from "../redux/types";

export const getTableAlternativesHeaders = (methods: ResultsMethod[]) => {
  if (methods.length === 0) return [];
  return methods[0].preference.map((_, idx) => `A${idx + 1}`);
};

export const getTableMethodsLabels = (methods: ResultsMethod[]) => {
  return methods.map((res) =>
    [
      res.method.toUpperCase(),
      res.weights.toUpperCase(),
      ...Object.values(res.additional).map(
        (item) => `| ${item.split("_").join(" ").toUpperCase()}`
      ),
    ].join(" ")
  );
};

export const getTableMethodsData = (
  methods: ResultsMethod[],
  precision?: number
) => {
  return methods.map((res) => {
    return res.preference.map((pref) => {
      return precision ? pref.toFixed(precision) : pref;
    });
  });
};

export const getTableTitle = (
  ids: [] | number[],
  idx: number,
  label: string
) => {
  if (ids.length > idx) {
    return `${label} ID ${ids[idx]}`;
  }
  return `${label} ID`;
};

export const getTableWeightsHeaders = (methods: ResultsMethod[]) => {
  if (methods.length === 0) return [];
  return methods[0].weights_value.map((_, idx) => `C${idx + 1}`);
};

export const getTableWeightsLabels = (methods: ResultsMethod[]) => {
  let weightsMethods: string[] = [];

  methods.forEach((res) => {
    if (!weightsMethods.includes(res.weights)) {
      weightsMethods = [...weightsMethods, res.weights];
    }
  });
  return weightsMethods;
};

export const getTableWeightsData = (
  methods: ResultsMethod[],
  precision?: number
) => {
  let weightsMethods: string[] = [];
  let data: string[][] = [];

  methods.forEach((res) => {
    if (!weightsMethods.includes(res.weights)) {
      weightsMethods = [...weightsMethods, res.weights];
      data = [
        ...data,
        res.weights_value.map((val) => {
          if (Array.isArray(val)) {
            return `[${val
              .map((v) => {
                return precision ? v.toFixed(precision) : `${v}`;
              })
              .join(", ")}]`;
          } else return precision ? val.toFixed(precision) : `${val}`;
        }),
      ];
    }
  });
  return data;
};

export const getTableRankingsData = (rankings: ResultsMethodRankings[]) => {
  return rankings.map((rank, idx) => {
    return rank.ranking;
  });
};

export const getTableRankingHeaders = (rankings: ResultsMethodRankings[]) => {
  return rankings.map((rank, idx) => {
    return rank.ranking.map((r, i) => `A${i + 1}`);
  });
};

export const getTableRankingLabels = (rankings: ResultsMethodRankings[]) => {
  console.log(rankings);
  return rankings.map((rank, idx) => {
    return `${rank.methods.method.toUpperCase()} ${rank.methods.weights.toUpperCase()}`;
  });
};

export const getTablePreferenceCorrelationData = (
  corr: ResultsMethodCorrelations,
  precision?: number
) => {
  if (!precision) return corr.results;

  return corr.results.map((row) => {
    return row.map((r) => r.toFixed(precision));
  });
};

export const getTablePreferenceCorrelationLabels = (
  corr: ResultsMethodCorrelations
) => {
  console.log(corr);
  return corr.methods.map(
    (m) => `${m.method.toUpperCase()} ${m.weights.toUpperCase()}`
  );
  // return corr.methods.map((res) =>
  //   [
  //     res.method.toUpperCase(),
  //     res.weights.toUpperCase(),
  //     ...Object.values(res.additional).map(
  //       (item) => `| ${item.split("_").join(" ").toUpperCase()}`
  //     ),
  //   ].join(" ")
  // );
};

export const getTableCorrelationTitle = (corr: ResultsMethodCorrelations) => {
  return corr.correlation;
};
