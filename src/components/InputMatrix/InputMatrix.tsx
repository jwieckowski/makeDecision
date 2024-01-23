import { ChangeEvent, FocusEvent } from 'react';
import { Container, Stack, Box, Typography } from '@mui/material';

// COMPONENTS
import Input from '@/components/Input';
import CriteriaTypes from '@/components/CriteriaTypes';

// CONST
import { MAX_ALTERNATIVES, MAX_CRITERIA } from '@/common/calculations';
import { MATRIX_LABEL_WIDTH, MATRIX_INPUT_WIDTH } from '@/common/ui';

type MatrixCellProps = {
  value: string;
  error: boolean;
};

type MatrixProps = {
  matrix: MatrixCellProps[][];
  alternatives: number;
  criteria: number;
  extension: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, row: number, col: number) => void;
  criteriaTypes: string[];
  onCriteriaTypeChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, col: number) => void;
  onMatrixBlur: (e: FocusEvent<HTMLInputElement>, row: number, col: number) => void;
};

export default function InputMatrix({
  matrix,
  alternatives,
  criteria,
  extension,
  onChange,
  criteriaTypes,
  onCriteriaTypeChange,
  onMatrixBlur,
}: MatrixProps) {
  if (alternatives === 0 || criteria === 0) return null;

  return (
    <Container maxWidth="md" disableGutters sx={{ overflow: 'auto', maxHeight: '400px', pb: 2 }}>
      {/* MATRIX HEADER */}
      <Stack
        direction="row"
        sx={{
          justifyContent: criteria < 4 ? 'center' : 'start',
        }}
      >
        {matrix.length > 0 &&
          matrix[0].length > 0 &&
          Array(criteria + 1 <= MAX_CRITERIA + 1 ? criteria + 1 : MAX_CRITERIA + 1)
            .fill(0)
            .map((_, col) => {
              return (
                <Box key={`col-label-${col}`}>
                  <Typography
                    align="center"
                    sx={{ width: col === 0 ? `${MATRIX_LABEL_WIDTH}px` : `${MATRIX_INPUT_WIDTH}px` }}
                  >
                    {col === 0 ? '' : `C${col}`}
                  </Typography>
                </Box>
              );
            })}
      </Stack>

      {matrix.length > 0 && matrix[0].length > 0
        ? Array(alternatives <= MAX_ALTERNATIVES ? alternatives : MAX_ALTERNATIVES)
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
                  {/* MATRIX BODY */}
                  {Array(criteria + 1 <= MAX_CRITERIA + 1 ? criteria + 1 : MAX_CRITERIA + 1)
                    .fill(0)
                    .map((_, col) => {
                      return (
                        <Box key={`row-${row}-${col}`} sx={{ m: 0, p: 0 }}>
                          {col === 0 ? (
                            <Typography
                              sx={{
                                width: `${MATRIX_LABEL_WIDTH}px`,
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              A{row + 1}
                            </Typography>
                          ) : (
                            <Input
                              type="string"
                              value={
                                matrix.length === alternatives && matrix[0]?.length === criteria
                                  ? matrix[row][col - 1].value
                                  : extension === 'crisp'
                                  ? '0'
                                  : '0, 0, 0'
                              }
                              onChange={(e) => {
                                onChange(e, row, col - 1);
                              }}
                              textCenter
                              width={MATRIX_INPUT_WIDTH}
                              variant="outlined"
                              error={
                                matrix.length === alternatives && matrix[0]?.length === criteria
                                  ? matrix[row][col - 1]?.error
                                  : false
                              }
                              onBlur={(e) => onMatrixBlur(e, row, col - 1)}
                            />
                          )}
                        </Box>
                      );
                    })}
                </Stack>
              );
            })
        : null}

      {/* CRITERIA TYPES */}
      <CriteriaTypes criteria={criteria} criteriaTypes={criteriaTypes} onCriteriaTypeChange={onCriteriaTypeChange} />
    </Container>
  );
}
