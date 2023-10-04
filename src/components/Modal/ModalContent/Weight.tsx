import React, { useState, useEffect } from 'react';
import { Container, Stack } from '@mui/material';

// REDUX
import { useAppDispatch } from '@/state';
import { BlockType } from '@/types';

// SLICES
import { setBlockWeights } from '@/state/slices/blocksSlice';

// COMPONENTS
import Input from '@/components/Input';

// CONST
import { MAX_CRITERIA } from '@/common/const';

// UTILS
import useValidation from '@/utils/validation';
import { convertCrispInput, convertFuzzyInput } from '@/utils/formatting';

type WeightsProps = {
  data: null | BlockType;
};

export default function Weights({ data }: WeightsProps) {
  const [userWeights, setUserWeights] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const { validateCrispInput, validateFuzzyInput } = useValidation();

  useEffect(() => {
    if (data === null) return;

    if (data.data.weights.length === 0) {
      let value;
      if (data.data.extension === 'crisp') value = '0';
      else if (data.data.extension === 'fuzzy') value = '0, 0, 0';

      const copy = Array(data.data.criteria <= MAX_CRITERIA ? data.data.criteria : MAX_CRITERIA).fill(value);

      setUserWeights([...copy]);
    } else setUserWeights([...data.data.weights]);
  }, [data]);

  useEffect(() => {
    if (data === null) return;

    let value = '';
    if (data.data.extension === 'crisp') value = '0';
    else if (data.data.extension === 'fuzzy') value = '0, 0, 0';

    if (data.data.criteria > 0) {
      let copy = Array(data.data.criteria <= MAX_CRITERIA ? data.data.criteria : MAX_CRITERIA).fill(value);

      if (data.data.weights.length > 0) {
        if (
          (data.data.extension === 'crisp' && !`${data.data.weights[0]}`.includes(',')) ||
          (data.data.extension === 'fuzzy' && `${data.data.weights[0]}`.includes(','))
        )
          copy = copy.map((r, idx) => {
            return idx < data.data.weights.length ? `${data.data.weights[idx]}` : r;
          });
      }

      setUserWeights([...copy]);
      dispatch(
        setBlockWeights({
          id: data?._id,
          data: [...copy.map((r) => (data.data.extension === 'crisp' ? +r : r))],
        }),
      );
    }
  }, [data?.data.criteria, data?.data.extension]);

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, col: number) {
    e.preventDefault();
    if (data === null) return;

    // VALIDATE INPUT
    if (!validateCrispInput(data, e.target.value) || !validateFuzzyInput(data, e.target.value)) return;

    // COPY WEIGHTS AND CHANGE SINGLE VALUE
    let copy = [...userWeights];
    copy = copy.map((w, idx) => {
      return idx === col
        ? data?.data.extension === 'crisp'
          ? convertCrispInput(e.target.value)
          : convertFuzzyInput(e.target.value)
        : w;
    });

    setUserWeights(copy);
    dispatch(setBlockWeights({ id: data?._id, data: copy }));
  }

  return (
    <Container maxWidth="xs" disableGutters>
      {data !== null ? (
        <Stack
          direction="row"
          style={{
            width: '100%',
            display: 'flex',
            gap: '8px',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: data.data.criteria < 6 ? 'center' : 'start',
          }}
        >
          {Array(data.data.criteria <= MAX_CRITERIA ? data?.data.criteria : MAX_CRITERIA)
            .fill(0)
            .map((_, col) => {
              return (
                <div key={`row-${col}`}>
                  <Input
                    type="string"
                    value={
                      col < userWeights.length ? userWeights[col] : data.data.extension === 'crisp' ? '0' : '0, 0, 0'
                    }
                    label={`C${col + 1}`}
                    onChange={(e) => handleInputChange(e, col)}
                    textCenter
                  />
                </div>
              );
            })}
        </Stack>
      ) : null}
    </Container>
  );
}
