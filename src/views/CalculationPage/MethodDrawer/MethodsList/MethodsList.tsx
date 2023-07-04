import React, { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ListGroup from "react-bootstrap/ListGroup";

// REDUX
import { RootState, useAppDispatch } from "../../../../redux";
import { AllMethodsItem } from "../../../../redux/types";

// SLICES
import { addBlock } from "../../../../redux/slices/blocksSlice";
import { fetchAllMethods } from "../../../../redux/slices/dictionarySlice";

// COMPONENTS
import Item from "./Item";

// HOOKS
import { useLocale } from "../../../../hooks";

// UTILS
import { filterMethodsType } from "../../../../utilities/filtering";

// CONST
import {
  METHODS_LIST_HEIGHT,
  DEFAULT_ALTERNATIVES,
  DEFAULT_CRITERIA,
} from "../../../../common/const";

// STYLES
import globalStyles from "../../../../common/globalStyles";

export default function MethodsList() {
  const dispatch = useAppDispatch();
  const { query } = useSelector((state: RootState) => state.search);
  const { allMethods } = useSelector((state: RootState) => state.dictionary);
  const { t } = useTranslation();
  const { locale } = useLocale();

  useEffect(() => {
    if (locale === "") return;
    if (allMethods.length === 0) dispatch(fetchAllMethods(locale));
  }, [locale]);

  function handleMethodItemClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    type: string,
    typeLabel: string,
    method: string,
    label: string,
    inputConnections: [] | string[],
    outputConnections: [] | string[]
  ) {
    e.preventDefault();

    const block = {
      type: type.includes("matrix")
        ? type.split(" ")[1].toLowerCase()
        : type.toLowerCase(),
      typeLabel: typeLabel.toLocaleLowerCase(),
      method: method.toLowerCase(),
      label: label.toLowerCase(),
      inputConnections,
      outputConnections,
      data: {
        matrix: [],
        matrixFile: [],
        fileName: null,
        randomMatrix: [],
        types: [],
        weights: [],
        extension: "crisp",
        additionals: [],
        alternatives: DEFAULT_ALTERNATIVES,
        criteria: DEFAULT_CRITERIA,
        styles: null,
      },
    };
    dispatch(addBlock(block));
  }

  const filteredData: [] | AllMethodsItem[] = useMemo(() => {
    if (locale === "") return [];

    let temp: [] | AllMethodsItem[] = [];

    filterMethodsType(allMethods, "primary").forEach((methods) => {
      if (methods.key.toLowerCase().includes(query.toLowerCase())) {
        temp = [...temp, methods];
      } else {
        const filteredMethods = { ...methods };
        filteredMethods.data = [];
        methods.data.forEach((method) => {
          if (method.name.toLowerCase().includes(query.toLowerCase())) {
            filteredMethods.data = [...filteredMethods.data, method];
          }
        });
        if (filteredMethods.data.length > 0) temp = [...temp, filteredMethods];
      }
    });

    return temp;
  }, [allMethods, query, locale]);

  return (
    <ListGroup
      variant="flush"
      style={{
        height: `${METHODS_LIST_HEIGHT}px`,
        overflowY: "scroll",
      }}
    >
      {filteredData.map((methods, index) => {
        return (
          <Item
            key={`item-${index}`}
            methods={methods}
            index={index}
            onClick={handleMethodItemClick}
          />
        );
      })}
      {filteredData.length === 0 ? (
        <ListGroup.Item>
          <div style={{ ...globalStyles.textBold }}>{`${t(
            "common:no-methods"
          )}`}</div>
        </ListGroup.Item>
      ) : null}
    </ListGroup>
  );
}
