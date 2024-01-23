import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Box, Typography } from '@mui/material';

// COMPONENTS
import Select from '@/components/Select';

// CONST
import { MAX_CRITERIA } from '@/common/calculations';
import { MATRIX_LABEL_WIDTH, MATRIX_INPUT_WIDTH } from '@/common/ui';

type CriteriaTypesProps = {
  criteria: number;
  criteriaTypes: string[];
  onCriteriaTypeChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, col: number) => void;
};

export default function CriteriaTypes({ criteria, criteriaTypes, onCriteriaTypeChange }: CriteriaTypesProps) {
  const { t } = useTranslation();

  const types = [
    {
      label: t('results:profit'),
      value: '1',
    },
    {
      label: t('results:cost'),
      value: '-1',
    },
  ];

  return (
    <Stack
      key={`criteria-types`}
      direction="row"
      sx={{
        mt: 1,
        width: '100%',
        display: 'flex',
        justifyContent: criteria < 4 ? 'center' : 'start',
        alignItems: 'center',
      }}
    >
      {Array(criteria <= MAX_CRITERIA ? criteria + 1 : MAX_CRITERIA + 1)
        .fill(0)
        .map((_, col) => {
          return (
            <Box key={`ct-${col}`} sx={{ m: 0, p: 0, px: col === 0 ? 0 : '2px' }}>
              {col === 0 ? (
                <Typography align="center" sx={{ width: `${MATRIX_LABEL_WIDTH}px` }}>
                  {t('results:types')}
                </Typography>
              ) : (
                <Select
                  items={types}
                  value={
                    criteriaTypes === null || criteriaTypes.length === 0 || criteriaTypes.length < criteria
                      ? '1'
                      : criteriaTypes[col - 1]
                  }
                  onChange={(e) => onCriteriaTypeChange(e, col - 1)}
                  minWidth={MATRIX_INPUT_WIDTH - 4}
                  fontSize={12}
                />
              )}
            </Box>
          );
        })}
    </Stack>
  );
}
