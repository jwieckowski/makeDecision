import { useMemo, ChangeEvent, FocusEvent } from 'react';
import { Container, Stack, Box, Typography } from '@mui/material';

// COMPONENTS
import Input from '@/components/Input';

// CONST
import { MAX_CRITERIA, MATRIX_LABEL_WIDTH, MATRIX_INPUT_WIDTH, STEP_CURVENESS_VALUE } from '@/common/const';

type ArrayValueItem = {
  value: string;
  error: boolean;
};

type MyArrayProps = {
  criteria: number;
  dimension: number;
  values: ArrayValueItem[][];
  onChange: (e: ChangeEvent<HTMLInputElement>, row: number, col: number) => void;
  min?: number;
  max?: number;
  onBlur?: (e: FocusEvent<HTMLInputElement>, row: number, col: number) => void;
  helperTexts?: string[];
};

export default function MyArray({
  criteria,
  dimension,
  values,
  onChange,
  onBlur,
  min,
  max,
  helperTexts,
}: MyArrayProps) {
  const criteriaOffset = useMemo(() => (dimension === 1 ? 0 : 1), []);

  return (
    <Container maxWidth="md" disableGutters sx={{ overflow: 'auto', maxWidth: '500px', pb: 2 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: criteria < 4 ? 'center' : 'start',
        }}
      >
        {criteria > 0
          ? Array(
              criteria + criteriaOffset <= MAX_CRITERIA + criteriaOffset
                ? criteria + criteriaOffset
                : MAX_CRITERIA + criteriaOffset,
            )
              .fill(0)
              .map((_, col) => {
                return (
                  <Box key={`col-label-${col}`}>
                    <Typography
                      align="center"
                      sx={{
                        width: col === 0 && dimension !== 1 ? `${MATRIX_LABEL_WIDTH}px` : `${MATRIX_INPUT_WIDTH}px`,
                      }}
                    >
                      {col === 0 && dimension === 1 ? 'C1' : ''}
                      {col !== 0 ? (dimension === 1 ? `C${col + 1}` : `C${col}`) : ''}
                    </Typography>
                  </Box>
                );
              })
          : null}
      </Stack>

      {Array(dimension)
        .fill(0)
        .map((_, row) => {
          return (
            <Stack
              key={`matrix-row-${row}`}
              direction="row"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: criteria < 4 ? 'center' : 'start',
              }}
            >
              {Array(criteria + 1 <= MAX_CRITERIA + 1 ? criteria + 1 : MAX_CRITERIA + 1)
                .fill(0)
                .map((_, col) => {
                  return (
                    <Box key={`row-${row}-${col}`} sx={{ m: 0, p: 0 }}>
                      {col === 0 && dimension !== 1 ? (
                        <Typography
                          align="center"
                          sx={{
                            width: `${MATRIX_LABEL_WIDTH}px`,
                            height: '100%',
                            pt: 1,
                          }}
                        >
                          {row === 0 ? 'Lower' : 'Upper'}
                        </Typography>
                      ) : col !== 0 ? (
                        <Input
                          type="string"
                          value={values[row]?.length >= col ? values[row][col - 1]?.value : ''}
                          error={values[row]?.length >= col ? values[row][col - 1]?.error : true}
                          onChange={(e) => onChange(e, row, col - 1)}
                          textCenter
                          width={MATRIX_INPUT_WIDTH}
                          variant="outlined"
                          min={min}
                          max={max}
                          step={STEP_CURVENESS_VALUE}
                          onBlur={(e) => (onBlur ? onBlur(e, row, col - 1) : {})}
                          helperText={
                            row === dimension - 1 && helperTexts && helperTexts.length >= col
                              ? helperTexts[col - 1]
                              : undefined
                          }
                        />
                      ) : null}
                    </Box>
                  );
                })}
            </Stack>
          );
        })}
    </Container>
  );
}
