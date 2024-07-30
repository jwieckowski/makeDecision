import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Typography } from '@mui/material';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import { useTour } from '@reactour/tour';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// HOOKS
import { useSurveyStatus, useLocale } from '@/hooks';

// COMPONENTS
import SettingsBar from './CalculationContent/SettingsBar';
import DragStory from './CalculationContent/DragStory';
import Results from './CalculationContent/Results';
import DraggableModal from '@/components/Modal/DraggableModal';
import SurveyModal from '@/components/Modal/SurveyModal';

// UTILS
import { scrollToElement } from '@/utils/scroll';

// API
import { fetchUsageSurvey } from '@/api/surveys';

// TYPES
import { SurveyUsage } from '@/types';

export default function Calculations() {
  const [survey, setSurvey] = useState<SurveyUsage | undefined>(undefined);
  const [surveyOpen, setSurveyOpen] = useState<boolean>(false);
  const { results, resultsLoading, errorModalOpen } = useAppSelector((state) => state.calculation);
  const { allMethods } = useAppSelector((state) => state.dictionary);

  const { isSurveyAnswered, isSurveyAnsweredToday } = useSurveyStatus();
  const { t } = useTranslation();
  const { locale } = useLocale();
  const dispatch = useAppDispatch();
  const { setIsOpen } = useTour();

  const handleSurveySave = async () => {
    setSurveyOpen(false);
    if (window.localStorage.getItem('tour') || allMethods.length === 0) return;
    setIsOpen(true);
  };

  const fetchSurveyData = async () => {
    dispatch(fetchUsageSurvey(locale))
      .then((data) => {
        setSurvey(data.payload);
        setSurveyOpen(true);
      })
      .catch((err) => {
        console.error(err);
      });
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
    <Container maxWidth={false} sx={{ mb: '50px' }} disableGutters className="tour-step-fourteen">
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
