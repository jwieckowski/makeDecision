import React, { ReactElement } from 'react';
import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

// COMPONENTS
import CsvCodes from './CSV';
import JsonCodes from './JSON';
import XlsxCodes from './XLSX';

type CodesProps = {
  type: string;
  data: string | any[][];
};

type CodesDict = {
  [key: string]: ReactElement;
};

export default function Codes({ type, data }: CodesProps) {
  const { t } = useTranslation();

  const codes: CodesDict = {
    csv: <CsvCodes data={data} />,
    json: <JsonCodes data={data} />,
    xlsx: <XlsxCodes data={data} />,
  };

  return (
    <Container
      sx={{
        backgroundColor: 'primary.light',
        border: '3px solid black',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        maxWidth: '75vw',
        overflowX: { xs: 'scroll', lg: 'hidden' },
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
        {t('common:example').toUpperCase()}
      </Typography>
      {codes[type]}
    </Container>
  );
}
