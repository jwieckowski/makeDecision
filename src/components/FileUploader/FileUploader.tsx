import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

// ICONS
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';

type FileUploaderProps = {
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
};

export default function FileUploader({ onUpload, label }: FileUploaderProps) {
  const { t } = useTranslation();
  return (
    <Container sx={{ my: 2 }}>
      <Container maxWidth={false} disableGutters sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Tooltip title={t('common:accepted-file-format-csv')}>
          <AttachFileIcon />
        </Tooltip>
        <Tooltip title={t('common:accepted-file-format-json')}>
          <AttachFileIcon />
        </Tooltip>
        <Tooltip title={t('common:accepted-file-format-xlsx')}>
          <AttachFileIcon />
        </Tooltip>
        <Tooltip title={t('common:file-formatting-guide')}>
          <HelpOutlineIcon />
        </Tooltip>
      </Container>
      <input
        id="upload-file"
        hidden
        accept="text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json"
        type="file"
        onChange={onUpload}
      />
      <label htmlFor="upload-file">
        <Button variant="outlined" component="span" sx={{ display: 'flex', flexDirection: 'column' }}>
          <CloudUploadIcon />
          {label ?? ''}
        </Button>
      </label>
    </Container>
  );
}
