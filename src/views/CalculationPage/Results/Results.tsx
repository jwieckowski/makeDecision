import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import { ArrowUpCircle } from "react-bootstrap-icons";

// REDUX
import { RootState } from "../../../redux";

// COMPONENTS
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Filters from "./Filters";

// STYLES
import globalStyles, { colors } from "../../../common/globalStyles";

// UTILS
import {
  getTableAlternativesHeaders,
  getTableMethodsLabels,
  getTableMethodsData,
  getTableWeightsData,
  getTableTitle,
  getTableWeightsLabels,
  getTableWeightsHeaders,
  getTableRankingsData,
  getTableRankingLabels,
  getTableRankingHeaders,
  getTablePreferenceCorrelationData,
  getTablePreferenceCorrelationLabels,
} from "../../../utilities/results";

export default function Results() {
  const { filteredResults, matrixId, loading, error } = useSelector(
    (state: RootState) => state.calculation
  );
  const { matrixFilter } = useSelector((state: RootState) => state.filters);
  const [filteredMatrixId, setFilteredMatrixId] = useState<number[]>(matrixId);

  const { t } = useTranslation();

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (matrixFilter !== "") setFilteredMatrixId([matrixId[+matrixFilter]]);
    else setFilteredMatrixId(matrixId);
  }, [filteredResults]);

  return filteredResults !== null ? (
    <Container
      fluid
      style={{
        padding: 0,
        margin: 0,
        marginTop: "100px",
      }}
      id="resultsContainer"
    >
      <Container
        fluid
        className="w-100 m-0 p-0 d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: colors.darkBackgroundFooter,
          height: "60px",
          fontSize: "24px",
          color: colors.light,
          boxShadow: "0px 5px 5px 0px rgba(66, 68, 90, 1)",
        }}
      >
        {t("results:results")}
      </Container>

      <Filters />

      {/* WEIGHTS */}
      <Stack gap={5} style={{ marginTop: "25px" }}>
        <div
          style={{
            ...globalStyles.heading,
            marginLeft: "100px",
            width: "300px",
            borderBottom: "1px solid black",
          }}
        >
          {t("results:weights")}
        </div>
        {filteredResults.method.map((result, idx) => {
          return (
            <Table
              key={`weights-table-${idx}`}
              data={getTableWeightsData(result, 4)}
              headers={getTableWeightsHeaders(result)}
              labels={getTableWeightsLabels(result)}
              style={globalStyles.resultsTableWrapper}
              title={getTableTitle(filteredMatrixId, idx, t("results:matrix"))}
            />
          );
        })}
      </Stack>

      {/* PREFERENCES */}
      <Stack gap={5} style={{ marginTop: "50px" }}>
        <div
          style={{
            ...globalStyles.heading,
            marginLeft: "100px",
            width: "300px",
            borderBottom: "1px solid black",
          }}
        >
          {t("results:preferences")}
        </div>
        {filteredResults.method.map((result, idx) => {
          return (
            <Table
              key={`preference-table-${idx}`}
              data={getTableMethodsData(result, 4)}
              headers={getTableAlternativesHeaders(result)}
              labels={getTableMethodsLabels(result)}
              style={globalStyles.resultsTableWrapper}
              title={getTableTitle(filteredMatrixId, idx, t("results:matrix"))}
            />
          );
        })}
      </Stack>

      {/* RANKING */}
      {filteredResults.methodRankings.length > 0 ? (
        <Stack gap={5} style={{ marginTop: "50px" }}>
          <div
            style={{
              ...globalStyles.heading,
              marginLeft: "100px",
              width: "300px",
              borderBottom: "1px solid black",
            }}
          >
            {t("results:ranking")}
          </div>
          {filteredResults.methodRankings.map((rankings, idx) => {
            return rankings.map((ranking, i) => {
              return (
                <Table
                  key={`ranking-table-${idx}-${i}`}
                  data={getTableRankingsData(ranking)}
                  headers={getTableRankingHeaders(ranking)[i]}
                  labels={getTableRankingLabels(ranking)}
                  style={globalStyles.resultsTableWrapper}
                  title={getTableTitle(
                    filteredMatrixId,
                    idx,
                    t("results:matrix")
                  )}
                />
              );
            });
          })}
        </Stack>
      ) : null}

      {/* PREFERENCES CORRELATIONS */}
      {filteredResults.methodCorrelations.length > 0 ? (
        <Stack gap={5} style={{ marginTop: "50px" }}>
          <div
            style={{
              ...globalStyles.heading,
              marginLeft: "100px",
              width: "300px",
              borderBottom: "1px solid black",
            }}
          >
            {t("results:correlation-preferences")}
          </div>
          {filteredResults.methodCorrelations.map((corrs, idx) => {
            return corrs.map((corr, i) => {
              return (
                <Table
                  key={`correlation-preference-table-${idx}-${i}`}
                  data={getTablePreferenceCorrelationData(corr, 4)}
                  headers={getTablePreferenceCorrelationLabels(corr)}
                  labels={getTablePreferenceCorrelationLabels(corr)}
                  style={globalStyles.resultsTableWrapper}
                  title={getTableTitle(
                    filteredMatrixId,
                    idx,
                    `${corr.correlation} - ${t("results:matrix")}`
                  )}
                />
              );
            });
          })}
        </Stack>
      ) : null}

      {/* RANKING CORRELATIONS */}
      {filteredResults.rankingCorrelations.length > 0 ? (
        <Stack gap={5} style={{ marginTop: "50px" }}>
          <div
            style={{
              ...globalStyles.heading,
              marginLeft: "100px",
              width: "300px",
              borderBottom: "1px solid black",
            }}
          >
            {t("results:correlation-ranking")}
          </div>
          {filteredResults.rankingCorrelations.map((corrs, idx) => {
            return corrs.map((corr, i) => {
              return (
                <Table
                  key={`correlation-preference-table-${idx}-${i}`}
                  data={getTablePreferenceCorrelationData(corr, 4)}
                  headers={getTablePreferenceCorrelationLabels(corr)}
                  labels={getTablePreferenceCorrelationLabels(corr)}
                  style={globalStyles.resultsTableWrapper}
                  title={getTableTitle(
                    filteredMatrixId,
                    idx,
                    `${corr.correlation} - ${t("results:matrix")}`
                  )}
                />
              );
            });
          })}
        </Stack>
      ) : null}

      {/* GO TO DRAG AREA */}
      <Container
        fluid
        className="w-100 pe-5 gap-2 d-flex justify-content-end align-items-center"
        style={{
          marginTop: "50px",
        }}
      >
        <Button
          text={t("common:go-to-filters")}
          icon={<ArrowUpCircle />}
          onClick={() => scrollToElement("resultsContainer")}
          style={{ ...globalStyles.buttonInfo, width: "140px" }}
        />
        <Button
          text={t("common:go-up")}
          icon={<ArrowUpCircle />}
          onClick={() => scrollToElement("navMenu")}
          style={{ ...globalStyles.buttonInfo, width: "140px" }}
        />
      </Container>
    </Container>
  ) : null;
}
