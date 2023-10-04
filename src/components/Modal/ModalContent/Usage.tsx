import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import { SelectChangeEvent } from '@mui/material';

// COMPONENTS
import Select from '@/components/Select';

export default function Usage() {
  const [option, setOption] = useState('');
  const { t } = useTranslation();

  const items = [
    {
      label: t('common:app-usage-option-1'),
      value: 'research',
    },
    {
      label: t('common:app-usage-option-2'),
      value: 'private',
    },
    {
      label: t('common:app-usage-option-3'),
      value: 'university',
    },
    {
      label: t('common:app-usage-option-4'),
      value: 'check',
    },
    {
      label: t('common:app-usage-option-5'),
      value: 'other',
    },
  ];

  const handleOptionChange = (event: SelectChangeEvent<string>) => {
    setOption(event.target.value as string);
  };

  return (
    <Container>
      <Select
        label={t('common:app-usage-label') as string}
        items={items}
        value={option}
        onChange={handleOptionChange}
      />
    </Container>
  );
}
