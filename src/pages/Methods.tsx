import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Box, Stack, Typography, Grid, Divider } from '@mui/material';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// SLICES
import { getMethodsDescriptions } from '@/api/descriptions';

// HOOKS
import { useLocale } from '@/hooks';

// COMPONENTS
import MarkdownText from '@/components/MarkdownText';
import Loader from '@/components/Loader';
import Select from '@/components/Select';
import Error from '@/components/Error';

export default function Methods() {
  const [groupIndex, setGroupIndex] = useState<number>(0);
  const [methodIndex, setMethodIndex] = useState<number>(0);
  const [groupValue, setGroupValue] = useState<string>('');
  const [methodValue, setMethodValue] = useState<string>('');

  const { methods, loading, error } = useAppSelector((state) => state.description);

  const { t } = useTranslation();
  const dataFetchedRef = useRef(false);
  const dispatch = useAppDispatch();
  const { locale } = useLocale();

  useEffect(() => {
    if (locale === '') return;
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    if (methods.length === 0) dispatch(getMethodsDescriptions(locale));
  }, [locale]);

  useEffect(() => {
    if (methods.length === 0) return;

    setGroupValue(methods[0].key);
    setMethodValue(methods[0].data[0].name);
  }, [methods]);

  useEffect(() => {
    if (methods.length === 0) return;

    setMethodValue(methods[groupIndex].data[0].name);
  }, [groupValue]);

  const changeCategory = (e: ChangeEvent<HTMLInputElement>) => {
    const idx = methods.findIndex((item) => item.key === e.target.value);
    setGroupIndex(idx);
    setGroupValue(e.target.value);
    setMethodIndex(0);
    setMethodValue(methods[idx].data[0].name);
  };

  const changeMethod = (e: ChangeEvent<HTMLInputElement>) => {
    setMethodValue(e.target.value);
    setMethodIndex(methods[groupIndex].data.findIndex((method) => method.name === e.target.value));
  };

  if (error) {
    return <Error />;
  }

  return (
    <Container maxWidth="lg" sx={{ my: '50px' }}>
      {loading ? (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loader size={150} />
        </Container>
      ) : (
        <Container maxWidth={false} disableGutters>
          <Divider textAlign="left">
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {t('common:filters')}
            </Typography>
          </Divider>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} my={3}>
            <Grid item xs={12} sm={12} md={6}>
              <Stack direction="column" gap={3}>
                <Select
                  value={groupValue}
                  items={
                    methods
                      ? methods.map((item) => {
                          return { value: item.key, label: item.key };
                        })
                      : []
                  }
                  onChange={(e) => changeCategory(e)}
                  label={t('common:categories')}
                  minWidth={300}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Stack direction="column" gap={3}>
                <Select
                  value={methodValue}
                  items={
                    methods.length > 0
                      ? methods[groupIndex].data.map((item) => {
                          return { value: item.name, label: item.name };
                        })
                      : []
                  }
                  onChange={(e) => changeMethod(e)}
                  label={t('common:methods')}
                  minWidth={300}
                />
              </Stack>
            </Grid>
          </Grid>

          <Stack mt={2}>
            <Divider textAlign="left">
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {t('common:description')}
              </Typography>
            </Divider>

            {methods[groupIndex]?.data[methodIndex]?.description ? (
              <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                <Stack gap={3} mt={2}>
                  {methods[groupIndex].data[methodIndex].description.map((text) => {
                    return (
                      <Box
                        key={`text-${groupIndex}-${methodIndex}-${text.id}`}
                        sx={{
                          display: 'flex',
                          '&::before': {
                            content: '""',
                            display: 'block',
                            width: '5px',
                            backgroundColor: 'primary.dark',
                            height: '100%',
                          },
                        }}
                      >
                        <MarkdownText text={text.text} key={`text-${text.id}`} />
                      </Box>
                    );
                  })}
                  {methods[groupIndex].data[methodIndex].description.length === 0 ? (
                    <Typography textAlign="center">{t('common:no-description')}</Typography>
                  ) : null}
                </Stack>
              </Container>
            ) : null}
          </Stack>
        </Container>
      )}
    </Container>
  );
}
