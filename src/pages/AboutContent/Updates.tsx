import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import ChangelogFile from '../../../CHANGELOG.md';

export default function Updates() {
  const [changelogText, setChangelogText] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    fetch(ChangelogFile)
      .then((response) => response.text())
      .then((text) => {
        setChangelogText(text);
      });
  }, []);

  return (
    <Container sx={{ my: '50px' }}>
      <Typography variant="h5" mb={4} sx={{ fontWeight: 'bold' }}>
        {t('about:updates').toUpperCase()}
      </Typography>

      <ReactMarkdown children={changelogText} />
    </Container>
  );
}
