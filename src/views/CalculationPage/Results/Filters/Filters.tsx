import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import { Save, Filter, XCircle } from "react-bootstrap-icons";

// REDUX
import { RootState, useAppDispatch } from "../../../../redux";

// SLICES
import {
  setMatrixFilter,
  setMethodFilter,
  setCorrelationFilter,
  clearFilters,
} from "../../../../redux/slices/filteringSlice";
import { setFilteredResults } from "../../../../redux/slices/calculationSlice";

// COMPONENTS
import Button from "../../../../components/Button";
import Select from "../../../../components/Select";

// UTILS
import { generateResultsFile } from "../../../../utilities/files";
import {
  getResultsMatrixItems,
  getResultsMethodItems,
  getResultsCorrelationItems,
  filterResults,
} from "../../../../utilities/filtering";

// STYLES
import globalStyles, { colors } from "../../../../common/globalStyles";

export default function Filters() {
  const { results, matrixId } = useSelector(
    (state: RootState) => state.calculation
  );
  const { matrixFilter, methodFilter, correlationFilter } = useSelector(
    (state: RootState) => state.filters
  );

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const getMatrixFilterItems = () => {
    return [
      { value: "", label: t("results:matrix") },
      ...getResultsMatrixItems(matrixId, t("results:matrix")),
    ];
  };

  const getMethodFilterItems = () => {
    if (!results?.method) return [{ value: "", label: t("results:method") }];
    return [
      { value: "", label: t("results:method") },
      ...getResultsMethodItems(
        results?.method,
        matrixFilter === "" ? null : +matrixFilter
      ),
    ];
  };

  const getCorrelationFilterItems = () => {
    if (!results?.methodCorrelations || !results?.rankingCorrelations)
      return [{ value: "", label: t("results:method") }];
    return [
      { value: "", label: t("results:correlation") },
      ...getResultsCorrelationItems(
        results?.methodCorrelations,
        results?.rankingCorrelations,
        matrixFilter === "" ? null : +matrixFilter
      ),
    ];
  };

  const handleResultsFiltering = () => {
    if (results === null) return;
    dispatch(
      setFilteredResults(
        filterResults(results, matrixFilter, methodFilter, correlationFilter)
      )
    );
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(setFilteredResults(results));
  };

  return (
    <Container
      fluid
      className="w-100 m-0 p-4 pe-2 d-flex gap-3 justify-content-end align-items-center"
      style={{
        height: "30px",
        backgroundColor: colors.light,
      }}
    >
      <Select
        items={getMatrixFilterItems()}
        value={matrixFilter}
        onChange={(e) => {
          dispatch(setMatrixFilter(e.target.value));
        }}
        style={{ width: "120px" }}
      />
      <Select
        items={getMethodFilterItems()}
        value={methodFilter}
        onChange={(e) => {
          dispatch(setMethodFilter(e.target.value));
        }}
        style={{ width: "120px" }}
      />
      <Select
        items={getCorrelationFilterItems()}
        value={correlationFilter}
        onChange={(e) => {
          dispatch(setCorrelationFilter(e.target.value));
        }}
        style={{ width: "120px" }}
      />
      <Button
        text={t("results:clear")}
        icon={<XCircle />}
        onClick={() => handleClearFilters()}
        disabled={results === null}
        style={globalStyles.buttonDanger}
      />
      <Button
        text={t("results:filter")}
        icon={<Filter />}
        onClick={() => handleResultsFiltering()}
        disabled={results === null}
      />
      <Button
        text={t("results:results")}
        icon={<Save />}
        onClick={() => (results !== null ? generateResultsFile(results) : {})}
        style={globalStyles.buttonInfo}
        disabled={results === null}
      />
    </Container>
  );
}
