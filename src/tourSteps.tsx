import { useTranslation } from 'react-i18next';
import { StepType } from '@reactour/tour';

const useTourSteps = () => {
  const { t } = useTranslation();

  const tourSteps: StepType[] = [
    {
      selector: '.tour-step-one',
      content: `${t('common:tutorial-step-1')}`,
      stepInteraction: false,
    },
    {
      selector: '.tour-step-two',
      content: `${t('common:tutorial-step-2')}`,
      stepInteraction: false,
    },
    {
      selector: '.tour-step-three',
      content: `${t('common:tutorial-step-3')}`,
      stepInteraction: false,
    },
    {
      selector: '.tour-step-four',
      content: `${t('common:tutorial-step-4')}`,
      stepInteraction: false,
    },
    {
      selector: '.tour-step-five',
      content: `${t('common:tutorial-step-5')}`,
      stepInteraction: false,
    },
    {
      selector: '.tour-step-six',
      content: `${t('common:tutorial-step-6')}`,
      disableActions: true,
    },
    {
      selector: '.tour-step-seven',
      content: `${t('common:tutorial-step-7')}`,
      stepInteraction: false,
      disableActions: false,
    },
    {
      selector: '.tour-step-eight',
      content: `${t('common:tutorial-step-8')}`,
      disableActions: true,
    },
    {
      selector: '.tour-step-nine',
      content: `${t('common:tutorial-step-9')}`,
    },
    {
      selector: '.tour-step-ten',
      content: `${t('common:tutorial-step-10')}`,
    },
    {
      selector: '.tour-step-eleven',
      content: `${t('common:tutorial-step-11')}`,
    },
    {
      selector: '.tour-step-twelve',
      content: `${t('common:tutorial-step-12')}`,
    },
    {
      selector: '.tour-step-one',
      content: `${t('common:tutorial-step-13')}`,
      stepInteraction: false,
      disableActions: false,
    },
    {
      selector: '.tour-step-thirteen',
      content: `${t('common:tutorial-step-14')}`,
      stepInteraction: false,
    },
    {
      selector: '.tour-step-fourteen',
      content: `${t('common:tutorial-step-15')}`,
      stepInteraction: false,
    },
  ];

  return { tourSteps };
};

export default useTourSteps;
