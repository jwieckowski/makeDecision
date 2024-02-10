import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Typography } from '@mui/material';

// ICONS
import AspectRatioIcon from '@mui/icons-material/AspectRatio';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// HOOKS
import { useSurveyStatus } from '@/hooks';

// COMPONENTS
import SettingsBar from './CalculationContent/SettingsBar';
import DragStory from './CalculationContent/DragStory';
import Results from './CalculationContent/Results';
import DraggableModal from '@/components/Modal/DraggableModal';
import SurveyModal from '@/components/Modal/SurveyModal';

// HOOKS
import { useLocale } from '@/hooks';

// UTILS
import { scrollToElement } from '@/utils/scroll';

// API
import { fetchUsageSurvey, getUsageSurveyItems } from '@/api/surveys';

// TYPES
import { SurveyUsage } from '@/types';

export default function Calculations() {
  const { isSurveyAnswered, isSurveyAnsweredToday } = useSurveyStatus();
  const { t } = useTranslation();
  const { locale } = useLocale();
  const dispatch = useAppDispatch();
  const { results, resultsLoading, errorModalOpen } = useAppSelector((state) => state.calculation);
  const [survey, setSurvey] = useState<SurveyUsage | undefined>(undefined);
  const [surveyOpen, setSurveyOpen] = useState<boolean>(false);

  console.log(results);

  const handleSurveySave = async () => {
    setSurveyOpen(false);
  };

  const fetchSurveyData = async () => {
    dispatch(fetchUsageSurvey(locale))
      .then((data) => {
        setSurvey(data.payload);
        setSurveyOpen(true);
      })
      .catch((err) => {
        console.log(err);
      });

    // dispatch(getUsageSurveyItems()).then((data) => {
    //   console.log(data);
    // });
  };

  useEffect(() => {
    if (locale === '') return;
    if (isSurveyAnswered() && isSurveyAnsweredToday()) return;
    fetchSurveyData();
  }, [locale]);

  useEffect(() => {
    if (resultsLoading == false) return;

    scrollToElement('resultsContainer');
  }, [resultsLoading]);

  return (
    <Container maxWidth={false} sx={{ mb: '50px' }} disableGutters>
      <Container maxWidth={false} sx={{ display: { xs: 'none', md: 'block' } }} disableGutters>
        <Container maxWidth={false} disableGutters sx={{ minHeight: '60px', backgroundColor: 'white' }}>
          <SettingsBar />
        </Container>
        <Container maxWidth={false} disableGutters sx={{ minHeight: '70vh' }}>
          <DragStory />
        </Container>
        {results !== null ? (
          <Container maxWidth={false} disableGutters sx={{ marginTop: 2 }}>
            <Results />
          </Container>
        ) : null}
        {errorModalOpen && <DraggableModal />}
        {survey && <SurveyModal open={surveyOpen} survey={survey} handleSave={handleSurveySave} />}
      </Container>
      {/* SMALL SCREEN INFO */}
      <Container
        sx={{
          display: { xs: 'flex', md: 'none' },
        }}
      >
        <Stack gap={3} sx={{ marginTop: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography align="center" variant="h4">
            {t('results:work-area')}
          </Typography>
          <AspectRatioIcon sx={{ fontSize: 60 }} />
          <Typography align="center" variant="h6">
            {t('results:work-area-size')}
          </Typography>
          <Typography align="center" variant="h6">
            {t('results:bigger-screen')}
          </Typography>
        </Stack>
      </Container>
    </Container>
  );
}
