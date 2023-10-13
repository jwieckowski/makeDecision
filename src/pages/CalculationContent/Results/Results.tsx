import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Divider, Typography } from '@mui/material';

// REDUX
import { useAppSelector } from '@/state';

// COMPONENTS
import Table from '@/components/Table';
import Filters from './Filters';
import Loader from '@/components/Loader';

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
} from '@/utils/results';

export default function Results() {
  const { filteredResults, matrixId, loading } = useAppSelector((state) => state.calculation);
  const { matrixFilter } = useAppSelector((state) => state.filters);
  const [filteredMatrixId, setFilteredMatrixId] = useState<number[]>(matrixId);

  const { t } = useTranslation();

  useEffect(() => {
    if (matrixFilter !== '') setFilteredMatrixId([matrixId[+matrixFilter]]);
    else setFilteredMatrixId(matrixId);
  }, [filteredResults]);

  return loading ? (
    <Container>
      <Loader />
    </Container>
  ) : filteredResults !== null ? (
    <Container id="resultsContainer">
      <Divider textAlign="center">
        <Typography variant="h5">{t('results:results')}</Typography>
      </Divider>

      <Filters />

      {/* WEIGHTS */}
      <Stack gap={5} mt={2}>
        <Divider textAlign="left">
          <Typography variant="h6">{t('results:weights')}</Typography>
        </Divider>
        {filteredResults.method.map((result, idx) => {
          return (
            <Table
              key={`weights-table-${idx}`}
              data={getTableWeightsData(result, 4)}
              headers={getTableWeightsHeaders(result)}
              labels={getTableWeightsLabels(result)}
              title={getTableTitle(filteredMatrixId, idx, t('results:matrix'))}
            />
          );
        })}
      </Stack>

      {/* PREFERENCES */}
      <Stack gap={5} mt={2}>
        <Divider textAlign="left">
          <Typography variant="h6">{t('results:preferences')}</Typography>
        </Divider>
        {filteredResults.method.map((result, idx) => {
          return (
            <Table
              key={`preference-table-${idx}`}
              data={getTableMethodsData(result, 4)}
              headers={getTableAlternativesHeaders(result)}
              labels={getTableMethodsLabels(result)}
              title={getTableTitle(filteredMatrixId, idx, t('results:matrix'))}
            />
          );
        })}
      </Stack>

      {/* RANKING */}
      {filteredResults.methodRankings.length > 0 ? (
        <Stack gap={5} mt={2}>
          <Divider textAlign="left">
            <Typography variant="h6">{t('results:ranking')}</Typography>
          </Divider>
          {filteredResults.methodRankings.map((rankings, idx) => {
            return rankings.map((ranking, i) => {
              return (
                <Table
                  key={`ranking-table-${idx}-${i}`}
                  data={getTableRankingsData(ranking)}
                  headers={getTableRankingHeaders(ranking)}
                  labels={getTableRankingLabels(ranking)}
                  title={getTableTitle(filteredMatrixId, idx, t('results:matrix'))}
                />
              );
            });
          })}
        </Stack>
      ) : null}

      {/* PREFERENCES CORRELATIONS */}
      {filteredResults.methodCorrelations.length > 0 ? (
        <Stack gap={5} mt={2}>
          <Divider textAlign="left">
            <Typography variant="h6">{t('results:correlation-preferences')}</Typography>
          </Divider>
          {filteredResults.methodCorrelations.map((corrs, idx) => {
            return corrs.map((corr, i) => {
              return (
                <Table
                  key={`correlation-preference-table-${idx}-${i}`}
                  data={getTablePreferenceCorrelationData(corr, 4)}
                  headers={getTablePreferenceCorrelationLabels(corr)}
                  labels={getTablePreferenceCorrelationLabels(corr)}
                  title={getTableTitle(filteredMatrixId, idx, `${corr.correlation} - ${t('results:matrix')}`)}
                />
              );
            });
          })}
        </Stack>
      ) : null}

      {/* RANKING CORRELATIONS */}
      {filteredResults.rankingCorrelations.length > 0 ? (
        <Stack gap={5} mt={2}>
          <Divider textAlign="left">
            <Typography variant="h6">{t('results:correlation-ranking')}</Typography>
          </Divider>
          {filteredResults.rankingCorrelations.map((corrs, idx) => {
            return corrs.map((corr, i) => {
              return (
                <Table
                  key={`correlation-preference-table-${idx}-${i}`}
                  data={getTablePreferenceCorrelationData(corr, 4)}
                  headers={getTablePreferenceCorrelationLabels(corr)}
                  labels={getTablePreferenceCorrelationLabels(corr)}
                  title={getTableTitle(filteredMatrixId, idx, `${corr.correlation} - ${t('results:matrix')}`)}
                />
              );
            });
          })}
        </Stack>
      ) : null}
    </Container>
  ) : null;
}
