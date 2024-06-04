import { useTranslation } from 'react-i18next';
import { Container, Stack, Typography, Tooltip, IconButton } from '@mui/material';

// ICONS
import FileCopyIcon from '@mui/icons-material/FileCopy';

// COMPONENTS
import LinedSubheader from '@/components/LinedSubheader';

type BibtexItemProps = {
  bibtexData: string;
  copyToClipboard: (item: string) => void;
  titleUppercase?: boolean;
};

export default function BibtexItem({ bibtexData, copyToClipboard, titleUppercase }: BibtexItemProps) {
  const { t } = useTranslation();
  return (
    <Container>
      <Stack spacing={3}>
        <LinedSubheader label={titleUppercase ? t('common:cite-us').toUpperCase() : t('common:cite-us')} />
        <Typography align="justify">{t('contact:cite-text-1')}</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#666', margin: 0 }}>{bibtexData}</pre>
          <Tooltip title={t('contact:copy-to-clipboard')}>
            <IconButton onClick={() => copyToClipboard(bibtexData)}>
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Container>
  );
}
