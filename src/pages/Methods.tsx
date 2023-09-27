import React, { useState, useEffect, useRef } from 'react';
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
import CardItem from '@/components/CardItem';

export default function Methods() {
  const [groupIndex, setGroupIndex] = useState<number | null>(null);
  const [methodIndex, setMethodIndex] = useState<number | null>(null);

  const { methods, loading } = useAppSelector((state) => state.description);

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
    setMethodIndex(null);
  }, [groupIndex]);

  return (
    <Container maxWidth="lg" sx={{ my: '50px' }}>
      {methods.length === 0 || loading ? (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loader size={100} />
        </Container>
      ) : (
        <Container>
          <Divider textAlign="left">
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {t('common:categories')}
            </Typography>
          </Divider>

          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} my={3}>
            {methods.map((method, groupIdx) => {
              return (
                <Grid item xs={12} sm={12} md={6} lg={4} key={`${method.key}-${method.id}`}>
                  <CardItem
                    elevation={groupIndex === groupIdx ? 8 : 2}
                    onClick={() => setGroupIndex(groupIdx)}
                    sx={{ backgroundColor: groupIndex === groupIdx ? 'primary.dark' : 'primary.light' }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {method.key}
                    </Typography>
                  </CardItem>
                </Grid>
              );
            })}
          </Grid>

          {groupIndex !== null ? (
            <>
              <Divider textAlign="left">
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {t('common:methods')}
                </Typography>
              </Divider>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} my={3}>
                {methods[groupIndex].data.map((method, methodIdx) => {
                  return (
                    <Grid item xs={12} sm={12} md={6} lg={4} key={`${method.name}-${method.id}`}>
                      <CardItem
                        elevation={methodIndex === methodIdx ? 8 : 2}
                        onClick={() => setMethodIndex(methodIdx)}
                        sx={{ backgroundColor: methodIndex === methodIdx ? 'primary.dark' : 'primary.light' }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {method.name}
                        </Typography>
                      </CardItem>
                    </Grid>
                  );
                })}
              </Grid>

              {methodIndex !== null && methods[groupIndex].data[methodIndex]?.description ? (
                <>
                  <Divider textAlign="left">
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {t('common:description')}
                    </Typography>
                  </Divider>

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
                </>
              ) : null}
            </>
          ) : null}
        </Container>
      )}
    </Container>
  );
}
