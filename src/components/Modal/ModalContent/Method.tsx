import React, { useState, useEffect, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Container from "react-bootstrap/Container";

// REDUX
import { RootState, useAppDispatch } from "../../../redux";
import { BlockType, AdditionalType } from "../../../redux/types";

// SLICES
import { setBlockAdditionals } from "../../../redux/slices/blocksSlice";

// COMPONENTS
import Select from "../../Select";

// UTILS
import {
  getFilteredMethods,
  getMethodData,
} from "../../../utilities/filtering";
import useBlocksConnection from "../../../utilities/connections";

// STYLES
import styles from "./styles.js";

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
  const { allMethods } = useSelector((state: RootState) => ({
    ...state.dictionary,
  }));
  const { getMethodsConnectedBlocksExtensions } = useBlocksConnection();

  const [metricsValues, setMetricsValues] = useState<AdditionalType[][] | []>(
    []
  );
  const [items, setItems] = useState<ItemProps[][][]>([]);
  const [metricNames, setMetricNames] = useState<string[][]>([]);
  const [connectedMatrices, setConnectedMatrices] = useState<MatricesProps[]>(
    []
  );

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleMetricChange = (
    e: ChangeEvent<HTMLInputElement>,
    idx: number,
    i: number
  ) => {
    let metricsTmp = [...metricsValues];
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
      })
    );
  };

  useEffect(() => {
    if (data === null) return;
    if (allMethods.length === 0) return;

    setItems([]);
    setMetricNames([]);
    setMetricsValues([]);

    // FOR EACH CONNECTED MATRIX GET PARAMETERS TO SET FOR A METHOD
    getMethodsConnectedBlocksExtensions(data).forEach((block) => {
      const newItem = getFilteredMethods(
        getMethodData(allMethods, data.type),
        block.extension
      ).find((item) => item.name.toLowerCase() === data.method);

      if (newItem?.additional === undefined) return;
      if (
        !newItem?.additional.map((i) => i.extension).includes(block.extension)
      )
        return;

      const additionals = newItem?.additional.find(
        (item) => item.extension === block.extension
      );

      if (additionals === undefined) return;
      let names: string[] = [];
      let methodItems: ItemProps[][] = [];
      let defaultMetrics: AdditionalType[] = [];

      additionals.data.forEach((item) => {
        names = [...names, item.method.toUpperCase()];

        methodItems = [
          ...methodItems,
          getFilteredMethods(
            getMethodData(allMethods, item.method),
            block.extension
          ).map((i, idx) => {
            if (idx === 0 && additionals.extension === block.extension) {
              defaultMetrics = [
                ...defaultMetrics,
                {
                  [item.parameter]: i.functionName ? i.functionName : i.name,
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
      if (data.data.additionals.length === 0)
        setMetricsValues((prev) => [...prev, defaultMetrics]);
      else setMetricsValues(data.data.additionals);
    });
  }, [data, allMethods]);

  return (
    <Container
      fluid
      style={{ ...styles.wrapper, flexDirection: "column" }}
      className="w-100 m-0 p-0"
    >
      {connectedMatrices.map((block, idx) => {
        return (
          <Container fluid className="w-100 m-0 p-0">
            <div className="w-100">
              {t("results:matrix")} ID {block.id} (
              {t(`results:${block.extension}`).toLowerCase()})
            </div>

            {metricsValues.length > 0 ? (
              <Container
                fluid
                className="d-flex gap-2 p-0 m-0 my-3 justify-content-center"
              >
                {items[idx]?.map((params, i) => {
                  return Object.keys(metricsValues[idx][i]) ? (
                    <Select
                      key={`parameter-${idx}-${i}`}
                      label={metricNames[idx][i]}
                      style={styles.selectMetrics}
                      labelStyle={styles.selectMetricsLabel}
                      items={params}
                      value={
                        metricsValues[idx][i]
                          ? metricsValues[idx][i][
                              Object.keys(metricsValues[idx][i])[0]
                            ]
                          : params[0].value
                      }
                      onChange={(e) => handleMetricChange(e, idx, i)}
                    />
                  ) : null;
                })}
              </Container>
            ) : null}
          </Container>
        );
      })}
    </Container>
  );
}
