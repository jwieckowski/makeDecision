import { ChangeEvent } from 'react';
import { Container, Stack, Box, Typography, SelectChangeEvent } from '@mui/material';

// COMPONENTS
import Array from '@/components/Array';

// CONST
import { MAX_CRITERIA, MATRIX_LABEL_WIDTH, MATRIX_INPUT_WIDTH, STEP_CURVENESS_VALUE } from '@/common/const';

type CValuesProps = {
  criteria: number;
  matrix: string[][];
  onChange: (e: ChangeEvent<HTMLInputElement>, idx: number) => void;
  min?: number;
  max?: number;
};

export default function CValues({ criteria, matrix, onChange, min, max }: CValuesProps) {
  const getMatrixCValues = () => {
    const cvalues = [];
    for (let j = 0; j < matrix[0].length; j++) {
      const temp = [];
      for (let i = 0; i < matrix.length; i++) {
        temp.push(+matrix[i][j]);
      }

      cvalues.push([Math.min(...temp), temp.reduce((acc, val) => acc + val, 0), Math.max(...temp)]);
    }
    return cvalues.map((v) => v.map((i) => i.toFixed(3)).join(', '));
  };

  return (
    <Container maxWidth="md" disableGutters sx={{ overflow: 'auto', maxWidth: '500px', pb: 2 }}>
      <Array criteria={criteria} dimension={1} values={getMatrixCValues()} onChange={onChange} />
    </Container>
  );
}
