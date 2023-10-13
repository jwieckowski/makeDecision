import { useTranslation } from 'react-i18next';
import { Container, Stack, Typography, Divider, Grid } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

// COMPONENTS
import Codes from '@/components/Codes';
import Button from '@/components/Button';

// CONST
import {
  JSON_CRISP_DATA,
  JSON_FUZZY_DATA,
  CSV_CRISP_DATA,
  CSV_FUZZY_DATA,
  XLSX_CRISP_DATA,
  XLSX_FUZZY_DATA,
  CRISP_JSON_FILE,
  FUZZY_JSON_FILE,
  CRISP_CSV_FILE,
  FUZZY_CSV_FILE,
  CRISP_XLSX_FILE,
  FUZZY_XLSX_FILE,
  APP_NAME_PATH,
  APP_URL,
} from '@/common/const';

export default function Files() {
  const { t } = useTranslation();

  const showJSON = (data: any) => {
    return JSON.stringify(
      data,
      function (k, v) {
        if (v instanceof Array) return JSON.stringify(v);
        return v;
      },
      2,
    );
  };

  const showCSV = (data: string[]) => {
    return data.join('\n');
  };

  const generateFile = (data: any, title: string) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = title;

    link.click();
  };

  const items = [
    {
      id: 1,
      title: t('about:crisp-json'),
      descriptions: [
        {
          id: 11,
          text: t('about:crisp-json-description-text-1'),
        },
        {
          id: 12,
          text: t('about:crisp-json-description-text-2'),
        },
        {
          id: 13,
          text: t('about:crisp-json-description-text-3'),
        },
      ],
      type: 'json',
      data: showJSON(JSON_CRISP_DATA),
      downloadFn: () => generateFile(JSON_CRISP_DATA, CRISP_JSON_FILE),
    },
    {
      id: 2,
      title: t('about:fuzzy-json'),
      descriptions: [
        {
          id: 21,
          text: t('about:fuzzy-json-description-text-1'),
        },
        {
          id: 22,
          text: t('about:fuzzy-json-description-text-2'),
        },
        {
          id: 23,
          text: t('about:fuzzy-json-description-text-3'),
        },
      ],
      type: 'json',
      data: showJSON(JSON_FUZZY_DATA),
      downloadFn: () => generateFile(JSON_FUZZY_DATA, FUZZY_JSON_FILE),
    },
    {
      id: 3,
      title: t('about:crisp-csv'),
      descriptions: [
        {
          id: 31,
          text: t('about:crisp-csv-description-text-1'),
        },
        {
          id: 32,
          text: t('about:crisp-csv-description-text-2'),
        },
        {
          id: 33,
          text: t('about:crisp-csv-description-text-3'),
        },
      ],
      type: 'csv',
      data: showCSV(CSV_CRISP_DATA),
      href: `${APP_URL}${APP_NAME_PATH}examples/${CRISP_CSV_FILE}`,
    },
    {
      id: 4,
      title: t('about:fuzzy-csv'),
      descriptions: [
        {
          id: 41,
          text: t('about:fuzzy-csv-description-text-1'),
        },
        {
          id: 42,
          text: t('about:fuzzy-csv-description-text-2'),
        },
        {
          id: 43,
          text: t('about:fuzzy-csv-description-text-3'),
        },
      ],
      type: 'csv',
      data: showCSV(CSV_FUZZY_DATA),
      href: `${APP_URL}${APP_NAME_PATH}examples/${FUZZY_CSV_FILE}`,
    },
    {
      id: 5,
      title: t('about:crisp-xlsx'),
      descriptions: [
        {
          id: 51,
          text: t('about:crisp-xlsx-description-text-1'),
        },
        {
          id: 52,
          text: t('about:crisp-xlsx-description-text-2'),
        },
        {
          id: 53,
          text: t('about:crisp-xlsx-description-text-3'),
        },
      ],
      type: 'xlsx',
      data: XLSX_CRISP_DATA,
      href: `${APP_URL}${APP_NAME_PATH}examples/${CRISP_XLSX_FILE}`,
    },
    {
      id: 6,
      title: t('about:fuzzy-xlsx'),
      descriptions: [
        {
          id: 61,
          text: t('about:fuzzy-xlsx-description-text-1'),
        },
        {
          id: 62,
          text: t('about:fuzzy-xlsx-description-text-2'),
        },
        {
          id: 63,
          text: t('about:fuzzy-xlsx-description-text-3'),
        },
      ],
      type: 'xlsx',
      data: XLSX_FUZZY_DATA,
      href: `${APP_URL}${APP_NAME_PATH}examples/${FUZZY_XLSX_FILE}`,
    },
  ];

  return (
    <Container sx={{ my: '50px' }}>
      <Typography variant="h5" mb={4} sx={{ fontWeight: 'bold' }}>
        {t('about:tab-3').toUpperCase()}
      </Typography>

      <Stack gap={5}>
        {items.map((item) => {
          return (
            <Stack gap={3} key={item.id}>
              <Divider textAlign="left">
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {item.title}
                </Typography>
              </Divider>

              {item.descriptions.map((text) => {
                return (
                  <Typography align="justify" key={text.id}>
                    {text.text}
                  </Typography>
                );
              })}

              <Codes type={item.type} data={item.data} />

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={8}>
                  <Typography align="justify">{t('about:file-bad-format')}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  {item?.downloadFn ? (
                    <Button
                      text={t('about:download-example-file')}
                      onClick={item.downloadFn}
                      endIcon={<DownloadIcon />}
                      fullWidth
                    />
                  ) : (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" download>
                      <Button
                        text={t('about:download-example-file')}
                        endIcon={<DownloadIcon />}
                        onClick={() => {}}
                        fullWidth
                      />
                    </a>
                  )}
                </Grid>
              </Grid>
            </Stack>
          );
        })}
      </Stack>
    </Container>
  );
}
