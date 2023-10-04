import React, { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Stack, Divider } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';
import { BlockType, ResultsAdditional } from '@/types';

// SLICES
import { setBlockAdditionals } from '@/state/slices/blocksSlice';

// COMPONENTS
import Select from '@/components/Select';

// UTILS
import { getFilteredMethods, getMethodData } from '@/utils/filtering';
import useBlocksConnection from '@/utils/connections';

type ItemProps = {
  value: string;
  label: string;
};

type MethodProps = {
  data: null | BlockType;
};

type MatricesProps = {
  id: number;
  extension: string;
};

export default function Method({ data }: MethodProps) {
  const { allMethods } = useAppSelector((state) => ({
    ...state.dictionary,
  }));

  const { connections } = useAppSelector((state) => ({
    ...state.blocks,
  }));

  const { getMethodsConnectedBlocksExtensions } = useBlocksConnection();

  const [metricsValues, setMetricsValues] = useState<ResultsAdditional[][] | []>([]);
  const [items, setItems] = useState<ItemProps[][][]>([]);
  const [metricNames, setMetricNames] = useState<string[][]>([]);
  const [connectedMatrices, setConnectedMatrices] = useState<MatricesProps[]>([]);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const getMetricValue = (idx: number, i: number) => {
    let value = undefined;
    if (Object.keys(metricsValues[idx][i])[0] === 'normalization_function')
      value = metricsValues[idx][i]?.normalization_function;
    if (Object.keys(metricsValues[idx][i])[0] === 'preference_function')
      value = metricsValues[idx][i]?.preference_function;
    if (Object.keys(metricsValues[idx][i])[0] === 'normalization') value = metricsValues[idx][i]?.normalization;
    if (Object.keys(metricsValues[idx][i])[0] === 'distance') value = metricsValues[idx][i]?.distance;
    if (Object.keys(metricsValues[idx][i])[0] === 'distance_1') value = metricsValues[idx][i]?.distance_1;
    if (Object.keys(metricsValues[idx][i])[0] === 'distance_2') value = metricsValues[idx][i]?.distance_2;

    return value === undefined ? '' : value;
  };

  const handleMetricChange = (e: ChangeEvent<HTMLInputElement>, idx: number, i: number) => {
    const metricsTmp = [...metricsValues];
    const key = metricsTmp[idx].flatMap((item) => {
      return Object.keys(item);
    })[i];
    metricsTmp[idx] = [
      ...metricsTmp[idx].map((item, n) => {
        return n === i
          ? {
              ...item,
              [key]: e.target.value,
            }
          : item;
      }),
    ];

    setMetricsValues(metricsTmp);

    dispatch(
      setBlockAdditionals({
        id: data?._id,
        data: metricsTmp,
      }),
    );
  };

  useEffect(() => {
    if (data === null) return;
    if (allMethods.length === 0) return;
    if (data.data.additionals.length !== 0 && data.data.additionals.length === items.length) return;

    setItems([]);
    setMetricNames([]);
    setMetricsValues([]);

    // FOR EACH CONNECTED MATRIX GET PARAMETERS TO SET FOR A METHOD
    const methodExtensions = getMethodsConnectedBlocksExtensions(data);

    methodExtensions.forEach((block, blockId) => {
      const newItem = getFilteredMethods(getMethodData(allMethods, data.type), block.extension).find(
        (item) => item.name.toLowerCase() === data.method,
      );

      if (newItem?.additional === undefined) return;
      if (!newItem?.additional.map((i) => i.extension).includes(block.extension)) return;

      const additionals = newItem?.additional.find((item) => item.extension === block.extension);

      if (additionals === undefined) return;
      let names: string[] = [];
      let methodItems: ItemProps[][] = [];
      let defaultMetrics: ResultsAdditional[] =
        data.data.additionals.length > blockId ? [...data.data?.additionals[blockId]] : [];

      additionals.data.forEach((item) => {
        names = [...names, item.method.toUpperCase()];

        methodItems = [
          ...methodItems,
          getFilteredMethods(getMethodData(allMethods, item.method), block.extension).map((i, idx) => {
            if (idx === 0 && additionals.extension === block.extension && data.data.additionals.length < blockId + 1) {
              defaultMetrics = [
                ...defaultMetrics,
                {
                  [item.parameter]: item.default,
                },
              ];
            }
            return {
              value: i.functionName ? i.functionName : i.name,
              label: i.name,
            };
          }),
        ];
      });

      setConnectedMatrices((prev) => {
        if (!prev.map((i) => i.id).includes(block.id)) return [...prev, block];
        return prev;
      });
      setMetricNames((prev) => [...prev, names]);
      setItems((prev) => [...prev, methodItems]);
      setMetricsValues((prev) => [...prev, defaultMetrics]);
    });
  }, [data, allMethods, connections]);

  useEffect(() => {
    if (metricsValues.length === 0) return;
    dispatch(
      setBlockAdditionals({
        id: data?._id,
        data: metricsValues,
      }),
    );
  }, [metricsValues]);

  return (
    <Container maxWidth="md" disableGutters>
      <Divider textAlign="center" sx={{ mb: 2 }}>
        {data?.method.toUpperCase()}
      </Divider>
      {connectedMatrices.map((block, idx) => {
        return (
          <Accordion key={block.id} elevation={4}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="matrix-accordion"
              id={`matrix-accordion-${idx}`}
            >
              <Typography>
                {t('results:matrix')} ID {block.id} ({t(`results:${block.extension}`).toLowerCase()})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {metricsValues.length > 0 && metricsValues.length === items.length ? (
                <Stack gap={2}>
                  {items[idx]?.map((params, i) => {
                    return Object.keys(metricsValues[idx][i]) ? (
                      <Select
                        key={`parameter-${idx}-${i}`}
                        label={metricNames[idx][i]}
                        items={params}
                        value={metricsValues[idx][i] ? getMetricValue(idx, i) : params[0].value}
                        onChange={(e) => handleMetricChange(e, idx, i)}
                        minWidth={120}
                      />
                    ) : null;
                  })}
                </Stack>
              ) : null}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Container>
  );
}
