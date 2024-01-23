// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { ChangeEvent, useState, FocusEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// COMPONENTS
import ArrayInput from '@/components/Array';

// REDUX
import { useAppSelector } from '@/state';
import { setBlockError, setBlockKwargs } from '@/state/slices/blocksSlice';

// UTILS
import useValidation from '@/utils/validation';
import { convertCrispInput, convertFuzzyInput } from '@/utils/formatting';

// CONST
import { DEFAULT_CRITERIA } from '@/common/calculations';

type ArrayParamsProps = {
  label: string;
  matrixId: number;
  kwargId: number;
  paramId: number;
  values: string[] | string[][];
  onChange: (arrayValues: string[][], kwargId: number, paramId: number) => void;
};

type ArrayValueItem = {
  value: string;
  error: boolean;
};

export default function ArrayParams({ label, matrixId, paramId, kwargId, values, onChange }: ArrayParamsProps) {
  const { blocks } = useAppSelector((state) => state.blocks);

  const { isCrispInputValid, isFuzzyInputValid } = useValidation();
  const { t } = useTranslation();

  console.log(values);

  const getMatrixCriteria = () => {
    return blocks.find((block) => block.id === matrixId)?.data.criteria ?? DEFAULT_CRITERIA;
  };

  const getInputMatrix = () => {
    return blocks.find((block) => block.id === matrixId)?.data.matrix ?? [];
  };

  // const getMatrixCValues = () => {
  //   const matrix = getInputMatrix();
  //   const cvalues = [];
  //   for (let j = 0; j < matrix[0].length; j++) {
  //     const temp = [];
  //     for (let i = 0; i < matrix.length; i++) {
  //       temp.push(+matrix[i][j]);
  //     }

  //     cvalues.push([Math.min(...temp), temp.reduce((acc, val) => acc + val, 0) / temp.length, Math.max(...temp)]);
  //   }
  //   return cvalues.map((v) => v.map((i) => i.toFixed(3)).join(', '));
  // };

  const getMatrixBounds = () => {
    const matrix = getInputMatrix();
    const minB = [];
    const maxB = [];
    for (let j = 0; j < matrix[1].length; j++) {
      const temp = [];
      for (let i = 0; i < matrix[0].length; i++) {
        temp.push(+matrix[i][j]);
      }
      minB.push(Math.min(...temp));
      maxB.push(Math.max(...temp));
    }
    return [minB, maxB];
  };

  const getMatrixBoundsHelperText = () => {
    const bounds = getMatrixBounds();
    return bounds[0].map((_, idx) => t('results:from-to', { from: bounds[0][idx], to: bounds[1][idx] }));
  };

  const getMeanESP = () => {
    const bounds = getMatrixBounds();
    return bounds[0].map((_, idx) => ((bounds[0][idx] + bounds[1][idx]) / 2).toFixed(3));
  };

  const getArrayInitialValue = () => {
    let value: ArrayValueItem[][] = [];
    if (
      ['p', 'q', 'characteristic values', 'expected solution points', 'reference ideal', 'reference points'].includes(
        label,
      )
    ) {
      if (values.length !== 0) value = [values.map((i) => ({ value: `${i}`, error: false }))];
      else {
        // if (label === 'characteristic values') value = [getMatrixCValues().map((i) => ({ value: i, error: true }))];
        if (['expected solution points', 'reference ideal', 'reference points'].includes(label))
          value = [getMeanESP().map((b) => ({ value: `${b}`, error: false }))];
        else
          value = [
            Array(getMatrixCriteria())
              .fill('0')
              .map((i) => ({ value: `${i}`, error: true })),
          ];
      }
    } else if (label === 'bounds') {
      if (values.length !== 0)
        value = (values as string[][]).map((row: string[]) => row.map((i) => ({ value: `${i}`, error: false })));
      else value = getMatrixBounds().map((row) => row.map((i) => ({ value: `${i}`, error: false })));
    }
    return value;
  };
  const [arrayValues, setArrayValues] = useState<ArrayValueItem[][]>(getArrayInitialValue());

  useEffect(() => {
    if (values.length !== 0) return;
    // SAVE ARRAY PARAM VALUES BY DEFAULT IN KWARGS ITEMS
    onChange(
      getArrayInitialValue().map((row) => row.map((i) => i.value)),
      kwargId,
      paramId,
    );
  }, []);

  const handleArrayValueChange = (e: ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    // VALIDATE INPUT
    const extension = label === 'characteristic values' ? 'fuzzy' : 'crisp';
    if (!isCrispInputValid(extension, e.target.value) || !isFuzzyInputValid(extension, e.target.value)) return;

    let copy;
    copy = [...arrayValues] as ArrayValueItem[][];
    copy = copy.map((r, idx) => {
      return idx === row
        ? r.map((c, idxx) => {
            return {
              ...c,
              value:
                idxx === col
                  ? extension === 'crisp'
                    ? convertCrispInput(e.target.value)
                    : convertFuzzyInput(e.target.value)
                  : c.value,
              error: false,
            };
          })
        : r;
    });
    const copyVal = copy.map((row) => row.map((v) => v.value));

    setArrayValues(copy);
    onChange(copyVal, kwargId, paramId);
  };

  const handleArrayValueBlur = (e: FocusEvent<HTMLInputElement>, row: number, col: number) => {
    // TODO validate input
    const isError = false;

    let copy = [...arrayValues];
    copy = copy.map((r, idx) => {
      return idx === row
        ? r.map((c, idxx) => {
            return {
              ...c,
              error: idxx === col ? isError : c.error,
            };
          })
        : r;
    });
    setArrayValues(copy);
  };

  const getArrayContent = () => {
    switch (label.toLowerCase()) {
      // case 'characteristic values':
      //   return (
      //     <ArrayInput
      //       criteria={getMatrixCriteria()}
      //       dimension={1}
      //       values={arrayValues}
      //       onChange={handleArrayValueChange}
      //       onBlur={handleArrayValueBlur}
      //     />
      //   );
      case 'expected solution points':
      case 'reference ideal':
      case 'reference points':
        return (
          <ArrayInput
            criteria={getMatrixCriteria()}
            dimension={1}
            values={arrayValues}
            onChange={handleArrayValueChange}
            onBlur={handleArrayValueBlur}
            helperTexts={getMatrixBoundsHelperText()}
          />
        );
      case 'bounds':
        return (
          <ArrayInput
            criteria={getMatrixCriteria()}
            dimension={2}
            values={arrayValues}
            onChange={handleArrayValueChange}
            onBlur={handleArrayValueBlur}
          />
        );
      case 'p':
      case 'q':
        return (
          <ArrayInput
            criteria={getMatrixCriteria()}
            dimension={1}
            values={arrayValues}
            onChange={handleArrayValueChange}
            onBlur={handleArrayValueBlur}
          />
        );
      default:
        return null;
    }
  };
  return <>{getArrayContent()}</>;
}
