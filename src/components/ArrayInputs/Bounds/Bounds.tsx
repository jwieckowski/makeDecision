import { ChangeEvent } from 'react';
import { Container, Stack, Box, Typography, SelectChangeEvent } from '@mui/material';

// COMPONENTS
import Input from '@/components/Input';

// CONST
import { MAX_CRITERIA, MATRIX_LABEL_WIDTH, MATRIX_INPUT_WIDTH, STEP_CURVENESS_VALUE } from '@/common/const';

type MyArrayProps = {
  criteria: number;
  dimension: number;
  onChange: (e: ChangeEvent<HTMLInputElement>, idx: number) => void;
  min?: number;
  max?: number;
};

export default function Bounds({ criteria, dimension, onChange, min, max }: MyArrayProps) {
  return <Container maxWidth="md" disableGutters sx={{ overflow: 'auto', maxWidth: '500px', pb: 2 }}></Container>;
}
